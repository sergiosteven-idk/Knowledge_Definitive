import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function ensureSeguridad(miembroId: number) {
  await prisma.miembroSeguridad.upsert({
    where: { miembroId },
    update: { intentosFallidos: 0, bloqueadoHasta: null },
    create: { miembroId }
  });
}

async function main() {
  const passwordAdmin = await bcrypt.hash('Admin123!', 12);
  const passwordDocente = await bcrypt.hash('Docente123!', 12);

  const admin = await prisma.administrador.upsert({
    where: { correo: 'admin@knowledge.com' },
    update: {},
    create: {
      nombre: 'Super Admin',
      correo: 'admin@knowledge.com',
      contrasena: passwordAdmin,
      tipoAdmin: 'super'
    }
  });

  const adminMiembro = await prisma.miembro.upsert({
    where: { correo: 'admin@knowledge.com' },
    update: {},
    create: {
      nombre: 'Super',
      apellido: 'Admin',
      correo: 'admin@knowledge.com',
      contrasena: passwordAdmin,
      tipoUsuario: 'docente',
      idAdmin: admin.idAdmin
    }
  });

  const docenteMiembro = await prisma.miembro.upsert({
    where: { correo: 'docente@knowledge.com' },
    update: {},
    create: {
      nombre: 'Docente',
      apellido: 'Guía',
      correo: 'docente@knowledge.com',
      contrasena: passwordDocente,
      tipoUsuario: 'docente'
    }
  });

  await Promise.all([ensureSeguridad(adminMiembro.idUsuario), ensureSeguridad(docenteMiembro.idUsuario)]);

  const [rolAdmin, rolDocente, rolEstudiante] = await Promise.all([
    prisma.rol.upsert({
      where: { nombreRol: 'admin' },
      update: {},
      create: {
        nombreRol: 'admin',
        descripcion: 'Acceso total a la plataforma'
      }
    }),
    prisma.rol.upsert({
      where: { nombreRol: 'docente' },
      update: {},
      create: {
        nombreRol: 'docente',
        descripcion: 'Gestiona cursos y evaluaciones'
      }
    }),
    prisma.rol.upsert({
      where: { nombreRol: 'estudiante' },
      update: {},
      create: {
        nombreRol: 'estudiante',
        descripcion: 'Participa en cursos y evalúa su progreso'
      }
    })
  ]);

  const permisos = [
    { recurso: 'curso', accion: 'create' },
    { recurso: 'curso', accion: 'update' },
    { recurso: 'curso', accion: 'delete' },
    { recurso: 'usuario', accion: 'read' },
    { recurso: 'evaluacion', accion: 'manage' }
  ];

  await Promise.all(
    permisos.map((permiso) =>
      prisma.permiso.upsert({
        where: { accion_recurso: { accion: permiso.accion, recurso: permiso.recurso } },
        update: {},
        create: permiso
      })
    )
  );

  const [permisosAdmin, permisosDocente] = await Promise.all([
    prisma.permiso.findMany(),
    prisma.permiso.findMany({ where: { recurso: { in: ['curso', 'evaluacion'] } } })
  ]);

  await Promise.all(
    permisosAdmin.map((permiso) =>
      prisma.rolPermiso.upsert({
        where: { idRol_idPermiso: { idRol: rolAdmin.idRol, idPermiso: permiso.idPermiso } },
        update: {},
        create: { idRol: rolAdmin.idRol, idPermiso: permiso.idPermiso }
      })
    )
  );

  await Promise.all(
    permisosDocente.map((permiso) =>
      prisma.rolPermiso.upsert({
        where: { idRol_idPermiso: { idRol: rolDocente.idRol, idPermiso: permiso.idPermiso } },
        update: {},
        create: { idRol: rolDocente.idRol, idPermiso: permiso.idPermiso }
      })
    )
  );

  await prisma.usuarioRol.upsert({
    where: { idUsuario_idRol: { idUsuario: adminMiembro.idUsuario, idRol: rolAdmin.idRol } },
    update: {},
    create: { idUsuario: adminMiembro.idUsuario, idRol: rolAdmin.idRol }
  });

  await prisma.usuarioRol.upsert({
    where: { idUsuario_idRol: { idUsuario: docenteMiembro.idUsuario, idRol: rolDocente.idRol } },
    update: {},
    create: { idUsuario: docenteMiembro.idUsuario, idRol: rolDocente.idRol }
  });

  await prisma.usuarioRol.upsert({
    where: { idUsuario_idRol: { idUsuario: docenteMiembro.idUsuario, idRol: rolEstudiante.idRol } },
    update: {},
    create: { idUsuario: docenteMiembro.idUsuario, idRol: rolEstudiante.idRol }
  });

  const curso = await prisma.curso.upsert({
    where: { idCurso: 1 },
    update: {},
    create: {
      nombre: 'Introducción a la accesibilidad web',
      descripcion: 'Buenas prácticas para construir experiencias digitales inclusivas.',
      categoria: 'Accesibilidad',
      nivel: 'intermedio',
      fechaInicio: new Date(),
      modulos: {
        create: [
          {
            nombreModulo: 'Fundamentos de accesibilidad',
            descripcion: 'Principios POUR y normas WCAG 2.2',
            evaluaciones: {
              create: {
                nombre: 'Evaluación inicial',
                descripcion: 'Comprueba tus conocimientos básicos',
                tipo: 'quiz',
                preguntas: {
                  create: [
                    {
                      texto: '¿Qué significa el principio Perceptible?',
                      tipo: 'opcion_multiple',
                      opciones: [
                        { valor: 'a', label: 'Que el contenido sea visible para el usuario' },
                        { valor: 'b', label: 'Que el contenido tenga animaciones' }
                      ],
                      respuestaCorrecta: 'a'
                    }
                  ]
                }
              }
            }
          },
          {
            nombreModulo: 'Implementación técnica',
            descripcion: 'Uso de ARIA, semántica y testing continuo'
          }
        ]
      }
    }
  });

  const primerModulo = await prisma.modulo.findFirst({ where: { idCurso: curso.idCurso } });
  if (primerModulo) {
    await prisma.progreso.upsert({
      where: { idProgreso: 1 },
      update: {},
      create: {
        idUsuario: docenteMiembro.idUsuario,
        idModulo: primerModulo.idModulo,
        estado: 'en_progreso'
      }
    });
  }

  console.log('Seed ejecutado correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
