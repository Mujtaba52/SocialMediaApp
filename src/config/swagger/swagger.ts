import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptions: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Social Networking app Api',
      description: 'Social Networking app Api description',
      contact: {
        name: 'Mujtaba Hassan'
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }
    ],
    servers: [{ url: 'http://localhost:4000/' }]
  },
  apis: ['./src/routes/*.ts']
}

export const swaggerDocs = swaggerJSDoc(swaggerOptions)
