import { NavLink, Outlet } from 'react-router-dom';
import logoHeader from '../assets/img/LogoHeader.svg';

const AdminLayout = () => {
    return (
    <>
        <header className="header pt-3">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <a href="#" className="d-flex align-items-center mb-2 mb-lg-0 me-5 text-dark text-decoration-none">
                        <img src={logoHeader} alt="logo"/>
                    </a>
                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 gap-3">
                        <li><NavLink to="/admin/product" className="nav-link px-2 link-secondary">產品管理</NavLink></li>
                        <li><NavLink to="/admin/order" className="nav-link px-2 link-secondary">訂單管理</NavLink></li>
                    </ul>
                    {/* <button type="submit" className="btn btn-primary ms-3" >登出</button> */}
                </div>
            </div>
        </header>
        <div className="contentAll pb-5">
            <Outlet />
        </div>
    </>
    )
}
export default AdminLayout;