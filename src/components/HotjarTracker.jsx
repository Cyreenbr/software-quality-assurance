import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant HotjarTracker pour le suivi des comportements utilisateur
 * 
 * Ce composant injecte le script de suivi Hotjar et configure le suivi automatique
 * des sessions, clics, mouvements de souris et heatmaps sur toutes les pages.
 * 
 * @requires VITE_HOTJAR_ID - Variable d'environnement contenant l'ID du site Hotjar
 */
const HotjarTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Récupération de l'ID Hotjar depuis les variables d'environnement
    const hotjarId = import.meta.env.VITE_HOTJAR_ID;
    
    // Si l'ID n'est pas configuré, on arrête l'exécution
    if (!hotjarId) {
      console.warn('Hotjar: VITE_HOTJAR_ID n\'est pas défini. Le suivi Hotjar est désactivé.');
      return;
    }

    // Fonction d'initialisation Hotjar
    const initHotjar = () => {
      // Vérifier si Hotjar n'est pas déjà initialisé
      if (window.hj) {
        return;
      }

      // Vérifier si le script Hotjar existe déjà dans le DOM
      if (document.getElementById('hotjar-script')) {
        return;
      }

      // Créer et injecter le script Hotjar
      const script = document.createElement('script');
      script.innerHTML = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${hotjarId},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `;
      
      script.id = 'hotjar-script';
      document.head.appendChild(script);

      // Attendre que Hotjar soit prêt avant de configurer le suivi
      const checkHotjarReady = setInterval(() => {
        if (window.hj) {
          clearInterval(checkHotjarReady);
          
          // Configuration du suivi
          // Hotjar enregistre automatiquement les sessions, clics, mouvements et heatmaps
          console.log('Hotjar: Suivi initialisé avec succès');
        }
      }, 100);

      // Timeout de sécurité (10 secondes)
      setTimeout(() => {
        clearInterval(checkHotjarReady);
      }, 10000);
    };

    // Initialiser Hotjar au montage du composant
    initHotjar();

    // Nettoyer lors du démontage
    return () => {
      // Note: Hotjar continue de fonctionner même après le démontage du composant
      // ce qui est le comportement souhaité pour le suivi continu
    };
  }, []); // Exécuté une seule fois au montage

  // Mettre à jour le chemin de la page dans Hotjar lors des changements de route
  useEffect(() => {
    if (window.hj && typeof window.hj === 'function') {
      try {
        // Enregistrer le changement de page/route pour un suivi précis
        window.hj('stateChange', location.pathname + location.search);
      } catch (error) {
        console.warn('Hotjar: Erreur lors de la mise à jour de la page', error);
      }
    }
  }, [location]);

  return null; // Ce composant ne rend rien visuellement
};

export default HotjarTracker;

