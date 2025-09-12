import Loading from "../components/common/Loading"

/**
 * LoadingPage
 * 
 * Page affichée lors du changement d'une ressource ou d'une donnée.
 * 
 * Rôle : 
 * - Entour le composant générique <Loading /> d'une div avec la classe page pour assurer
 * une mise en page cohérente avec le reste de l'application.
 * 
 * Utilisation : 
 * - Appelée par d'autres pages (ex: DashboardPage) quand l'état de chargement est actif.
 * @returns 
 */
export default function LoadingPage () {
    return (
        <div className="page">

            <Loading />

        </div>
    )
}