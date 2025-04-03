# React + Vite

## Pour tout le monde l karim (par Chedly)

ken t7eb tsahhel 3la rou7ek partie routage fel front taba3 les consgines li louta:

## ⚠️ **NB:**

### 📌 **Fi Fichier `menuHandler.js`** fi **dossier Services**

Ajouter un **Json** à `menuConfig` comme dans l'exemple ci-dessous :

**NB :just 3ammer les valeurs kaahw w matbaddel chay fel code w surtt assemi les variables w attributs sinon tod5el baadh'ha**

**NB** lazem tzid `dontShow : true,` m3a les elements ken bech te5dem b routage dynamique

```js
//lawej aala: menuConfig w fi west'ha
export const menuConfig = [
    //
    //zid fi e5er liste route kima hakka :
    {
        label: 'Home', //essm li yodhher fel menu
        icon: MdHome, //just chouf l essm Importih men biblio "react-icons" (chouf documentation en ligne https://react-icons.github.io/react-icons )
        path: '/', //hot l path exemple /login, /profile...
        component: Home, //menghir aka < /> just importih w hottou
        eligibleRoles: [ //tableau fih li aand'hom accesss kima mahtout louta
            RoleEnum.ADMIN, //ken admin
            RoleEnum.TEACHER, //ken teacher
            RoleEnum.STUDENT //ken Student
        ],
        active: true,
        hideSideBar: false, //menu
        hideHeader: false, //header
    },
    // Pour un routage dynamique
    {
        label: 'Home', //essm li yodhher fel menu
        icon: MdHome, //just chouf l essm Importih men biblio "react-icons" (chouf documentation en ligne https://react-icons.github.io/react-icons )
        path: (id)=> `/route/${id}`,
        dontShow : true, // lazem TZID'ha hedhy ken bech te5dem bel routage dynamique
        component: Home, //menghir aka < /> just importih w hottou
        eligibleRoles: [ //tableau fih li aand'hom accesss kima mahtout louta
            RoleEnum.ADMIN, //ken admin
            RoleEnum.TEACHER, //ken teacher
            RoleEnum.STUDENT //ken Student
        ],
        active: true,
        hideSideBar: false, //menu
        hideHeader: false, //header
    },
    //5alli l begui
]
// NB : matbaddel chay fel code w surtt assemi les variables w attributs just 3ammer les valeurs
```

## C.C

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
