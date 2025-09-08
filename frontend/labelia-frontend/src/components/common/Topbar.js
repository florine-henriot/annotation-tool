import "../../App.css";
import "./Topbar.css";

export default function TopBar( { icon: Icon, pageTitle }) {
    return (
        <div className="topbar-common">
            <img src='./avatar/logo_labelia.png' alt='Logo' className='logo' />
            <span className='site-name'>Labelia</span>

            <span className="breadcrumbs">
                <div className="page-title">
                    {Icon && <Icon size={18} style={{ marginRight: "10px" }} />}
                    {pageTitle}
                </div>
            </span>
        </div>
    )
}