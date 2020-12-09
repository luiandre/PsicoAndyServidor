/*jshint esversion: 9 */

const getMenuFrontEnd = (rol = 'USER_ROL') => {

    let menu = [];

    if (rol === 'ADMIN_ROL') {
        menu = [{
                titulo: 'PsicoAndy',
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
                titulo: 'Pacientes',
                icono: 'mdi mdi-ambulance',
                submenu: [
                    { titulo: 'Asignación', url: '/dashboard/asignaciones' },
                    { titulo: 'Historia Clínica', url: '/dashboard/historias' },
                    { titulo: 'Seguimiento', url: '/dashboard/seguimientos' },
                    { titulo: 'Citas', url: '/dashboard/citas' }
                ]
            }
        ];
    } else if (rol === 'PROF_ROL') {
        menu = [{
                titulo: 'PsicoAndy',
                icono: 'mdi mdi-arrow-down-drop-circle',
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
                titulo: 'Pacientes',
                icono: 'mdi mdi-ambulance',
                submenu: [
                    { titulo: 'Historia Clínica', url: '/dashboard/historias' },
                    { titulo: 'Seguimiento', url: '/dashboard/seguimientos' },
                    { titulo: 'Citas', url: '/dashboard/citas' }
                ]
            }
        ];
    } else {
        menu = [{
            titulo: 'PsicoAndy',
            icono: 'mdi mdi-arrow-down-drop-circle',
            submenu: [
                { titulo: 'Inicio', url: '/' },
                { titulo: 'Servicios', url: '/servicios' },
                { titulo: 'Conócenos', url: '/conocenos' },
                { titulo: 'Contáctanos', url: '/contactanos' },
            ]
        }];
    }

    return menu;
};

module.exports = {
    getMenuFrontEnd
};