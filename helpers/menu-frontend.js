/*jshint esversion: 9 */

const getMenuFrontEnd = (rol = 'USER_ROL') => {

    let menu = [];

    if (rol === 'ADMIN_ROL') {
        menu = [{
                titulo: 'Clínica',
                icono: 'mdi mdi-city',
                submenu: [
                    { titulo: 'Inicio', url: '/' },
                    { titulo: 'Servicios', url: '/servicios' },
                    { titulo: 'Conócenos', url: '/conocenos' },
                    { titulo: 'Contáctanos', url: '/contactanos' },
                ]
            },
            {
                titulo: 'Gestión',
                icono: 'mdi mdi-folder-multiple',
                submenu: [
                    { titulo: 'Principal', url: '/dashboard' },
                    { titulo: 'Usuarios', url: '/dashboard/usuarios' },
                    { titulo: 'Comunicados', url: '/dashboard/comunicados' },
                    { titulo: 'Noticias', url: '/dashboard/noticias' },
                    { titulo: 'Servicios', url: '/dashboard/servicios' }
                ]
            },
            {
                titulo: 'Salud',
                icono: 'mdi mdi-ambulance',
                submenu: [
                    { titulo: 'Asignación', url: '/dashboard/asignaciones' },
                    { titulo: 'Pacientes', url: '/dashboard/historias' },
                    { titulo: 'Citas', url: '/dashboard/citas' }
                ]
            }
        ];
    } else if (rol === 'PROF_ROL') {
        menu = [{
                titulo: 'Clínica',
                icono: 'mdi mdi-city',
                submenu: [
                    { titulo: 'Inicio', url: '/' },
                    { titulo: 'Servicios', url: '/servicios' },
                    { titulo: 'Conócenos', url: '/conocenos' },
                    { titulo: 'Contáctanos', url: '/contactanos' },
                ]
            },
            {
                titulo: 'Gestión',
                icono: 'mdi mdi-folder-multiple',
                submenu: [
                    { titulo: 'Principal', url: '/dashboard' },
                    { titulo: 'Noticias', url: '/dashboard/noticias' },
                    { titulo: 'Servicios', url: '/dashboard/servicios' }
                ]
            },
            {
                titulo: 'Salud',
                icono: 'mdi mdi-ambulance',
                submenu: [
                    { titulo: 'Pacientes', url: '/dashboard/historias' },
                    { titulo: 'Citas', url: '/dashboard/citas' }
                ]
            }
        ];
    } else {
        menu = [{
                titulo: 'Clínica',
                icono: 'mdi mdi-city',
                submenu: [
                    { titulo: 'Inicio', url: '/' },
                    { titulo: 'Servicios', url: '/servicios' },
                    { titulo: 'Conócenos', url: '/conocenos' },
                    { titulo: 'Contáctanos', url: '/contactanos' },
                ]
            },
            {
                titulo: 'Tests Autoaplicables',
                icono: 'mdi mdi-note',
                submenu: [
                    { titulo: 'Escala de autoestima', url: '/escalaAutoestima' },
                ]
            }
        ];
    }

    return menu;
};

module.exports = {
    getMenuFrontEnd
};