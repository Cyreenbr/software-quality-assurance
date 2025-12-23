import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ga4Service from "../../services/analytics/ga4.service";

/**
 * Composant pour tracker automatiquement les changements de page avec GA4
 * 
 * Ce composant doit être placé dans le Router pour suivre automatiquement
 * toutes les navigations React Router.
 */
const GA4PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Vérifier que GA4 est initialisé
    if (!ga4Service.getIsInitialized()) {
      return;
    }

    // Envoyer la pageview avec le chemin complet (pathname + search)
    const page = location.pathname + location.search;
    
    // Récupérer le titre de la page si disponible
    const title = document.title || location.pathname;

    ga4Service.sendPageView(page, title);
  }, [location]);

  return null; // Ce composant ne rend rien visuellement
};

export default GA4PageTracker;

