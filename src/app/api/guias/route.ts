  import { NextRequest, NextResponse } from "next/server";
  import { prisma } from "@/lib/prisma";
  import { getUser } from "@/lib/getUser";

  /**
   * =========================================
   * ID SEDE CENTRAL
   * =========================================
   */
  const CENTRAL_LOCAL_ID = 9;

 /**
 * =========================================
 * GET GUIAS
 * =========================================
 */

 export async function GET(req: NextRequest) {

  try {

    const { searchParams } =
      new URL(req.url);

    const estado =
      searchParams.get("estado");

    const modo =
      searchParams.get("modo");

    /**
     * USER
     */
    const user =
      await getUser();

    if (!user) {

      return NextResponse.json(
        {
          error: "No autorizado",
        },
        {
          status: 401,
        }
      );
    }

    /**
     * WHERE
     */
    const whereCondition: any = {};

    /**
     * =====================================
     * FILTRO POR ESTADO
     * =====================================
     */
    if (estado) {

      whereCondition.estado =
        estado;

      /**
       * =====================================
       * BORRADOR
       * GUIAS POR CERRAR
       * (ORIGEN)
       * =====================================
       */
      if (
        estado === "BORRADOR"
      ) {

        if (
          user.role === "LOCAL"
        ) {

          whereCondition.enviadoPorId =
            user.id;

        } else {

          whereCondition.enviadoPor = {

            role: "CENTRAL",
          };
        }
      }

      /**
       * =====================================
       * TRANSITO
       * GUIAS POR VALIDAR
       * (DESTINO)
       * =====================================
       */
      if (
        estado === "TRANSITO" &&
        modo === "validar"
      ) {

        if (
          user.role === "LOCAL"
        ) {

          whereCondition.destinoLocalId =
            user.localId;

        } else {

          whereCondition.destinoTipo =
            "CENTRAL";
        }
      }

      /**
       * =====================================
       * TRANSITO
       * LISTADO NORMAL
       * (ORIGEN)
       * =====================================
       */
      if (
        estado === "TRANSITO" &&
        modo !== "validar"
      ) {

        if (
          user.role === "LOCAL"
        ) {

          whereCondition.enviadoPorId =
            user.id;

        } else {

          whereCondition.enviadoPor = {

            role: "CENTRAL",
          };
        }
      }

    } else {

      /**
       * =====================================
       * TODAS LAS GUIAS
       * =====================================
       */
      whereCondition.estado = {

        in: [
          "BORRADOR",
          "TRANSITO",
          "RECIBIDA",
          "PARCIAL",
        ],
      };

      if (
        user.role === "LOCAL"
      ) {

        whereCondition.OR = [

          {
            origenLocalId:
              user.localId,
          },

          {
            destinoLocalId:
              user.localId,
          },
        ];

      } else {

        whereCondition.enviadoPor = {

          role: "CENTRAL",
        };
      }
    }

    /**
     * QUERY
     */
    const guias =
      await prisma.guide.findMany({

        where: whereCondition,

        include: {

          details: true,

          origenLocal: true,

          destinoLocal: true,

          enviadoPor: {

            include: {

              local: true,
            },
          },

          recibidoPor: true,

          encargadoUser: true,

          _count: {

            select: {

              details: true,
            },
          },
        },

        orderBy: {

          id: "desc",
        },
      });

    /**
     * RESPONSE
     */
    const response =
      guias.map((guia: { enviadoPor: { nombre: string; }; encargadoTipo: string; encargadoUser: { nombre: any; }; enviadoPorId: any; }) => {

        /**
         * ORIGEN
         */
        const origen =
          guia.enviadoPor?.nombre ||
          "-";

        /**
         * TRASLADO
         */
        const traslado =
          guia.encargadoTipo ===
          "TRANSPORTE"

            ? "TRANSPORTE"

            : guia.encargadoUser
                ?.nombre || "-";

        /**
         * SOLO EL ORIGEN
         * PUEDE OPERAR
         */
        const puedeOperar =
          guia.enviadoPorId ===
          user.id;

        return {

          ...guia,

          origen,

          traslado,

          puedeOperar,
        };
      });

    return NextResponse.json(
      response
    );

  } catch (error) {

    console.error(
      "ERROR OBTENIENDO GUIAS:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error obteniendo guías",
      },
      {
        status: 500,
      }
    );
  }
}

  /**
   * =========================================
   * CREAR GUIA
   * =========================================
   */
  export async function POST(req: NextRequest) {

    try {

      const body =
        await req.json();

      const {
        numero,
        encargadoTipo,
        encargadoId,
        destinoTipo,
        destinoLocalId,
        otroDestino,
        observaciones,
      } = body;

      /**
       * USER
       */
      const user =
        await getUser();

      if (!user) {

        return NextResponse.json(
          {
            error: "No autorizado",
          },
          {
            status: 401,
          }
        );
      }

      /**
       * VALIDAR NUMERO
       */
      if (!numero) {

        return NextResponse.json(
          {
            error:
              "Número requerido",
          },
          {
            status: 400,
          }
        );
      }

      /**
       * VALIDAR DUPLICADO
       */
      const existe =
        await prisma.guide.findUnique({

          where: {
            numero,
          },
        });

      if (existe) {

        return NextResponse.json(
          {
            error:
              "La guía ya existe",
          },
          {
            status: 400,
          }
        );
      }

      /**
       * ORIGEN
       */
      const origenLocalId =
        Number(user.localId);

      /**
       * DESTINO FINAL
       */
      let destinoFinalId:
        number | null = null;

      let destinoFinalTipo:
        "CENTRAL" |
        "LOCAL" |
        "OTROS";

      /**
       * =====================================
       * LOCAL -> CENTRAL
       * =====================================
       */
      if (user.role === "LOCAL") {

        destinoFinalTipo =
          "CENTRAL";

        destinoFinalId =
          CENTRAL_LOCAL_ID;

      } else {

        /**
         * CENTRAL
         */
        destinoFinalTipo =
          destinoTipo;

        /**
         * CENTRAL -> LOCAL
         */
        if (
          destinoTipo ===
          "LOCAL"
        ) {

          if (!destinoLocalId) {

            return NextResponse.json(
              {
                error:
                  "Debe seleccionar un local destino",
              },
              {
                status: 400,
              }
            );
          }

          destinoFinalId =
            Number(
              destinoLocalId
            );

          /**
           * VALIDAR EXISTENCIA
           */
          const localExiste =
            await prisma.local.findUnique({

              where: {
                id:
                  destinoFinalId,
              },
            });

          if (!localExiste) {

            return NextResponse.json(
              {
                error:
                  `El local destino ${destinoFinalId} no existe`,
              },
              {
                status: 400,
              }
            );
          }
        }
      }

      /**
       * CREAR GUIA
       */
      const guia =
        await prisma.guide.create({

          data: {

            /**
             * BASICO
             */
            numero,

            estado:
              "BORRADOR",

            observaciones,

            /**
             * ORIGEN
             */
            origenTipo:
              user.role ===
              "LOCAL"

                ? "LOCAL"

                : "CENTRAL",

            origenLocalId,

            /**
             * DESTINO
             */
            destinoTipo:
              destinoFinalTipo,

            destinoLocalId:
              destinoFinalId,

            otroDestino:
              destinoFinalTipo ===
              "OTROS"

                ? otroDestino

                : null,

            /**
             * RESPONSABLE
             */
            encargadoTipo,

            encargadoUserId:

              encargadoTipo ===
                "SOPORTE" &&
              encargadoId

                ? Number(
                    encargadoId
                  )

                : null,

            /**
             * QUIEN ENVIA
             */
            enviadoPorId:
              user.id,

            /**
             * FECHA
             */
            fechaEnvio:
              new Date(),
          },
        });

      return NextResponse.json(
        guia
      );

    } catch (error) {

      console.error(
        "ERROR CREANDO GUIA:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Error creando guía",
        },
        {
          status: 500,
        }
      );
    }
  }