import { Link, NavLink, Outlet } from 'react-router-dom';
import logoHeader from '../assets/img/LogoHeader.svg';

const routesNav = [
    {path: '/', name: '首頁'},
    {path: '/productList', name: '產品列表'},
    {path: '/about', name: '關於SmartPaw Life'},
]
const routesLinks = [
    {path: '/cart', name: '購物車', icon: 'shopping_cart'},
    {path: '/login', name: '登入管理介面', icon: 'person'}
]

const FrontLayout = () => {
    return (
    <>
        <header className="header pt-3">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-3">
                    <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 me-5 text-dark text-decoration-none">
                        <img src={logoHeader} alt="logo"/>
                    </Link>
                    <ul className="nav flex-fill gap-3">
                        {routesNav.map( route => (
                            <li key={route.path}>
                                <NavLink to={route.path} className="nav-link px-2 link-secondary">{route.name}</NavLink>
                            </li>
                        ))}
                    </ul>
                    {routesLinks.map(route => (
                        <Link to={route.path} className="link-secondary ms-3 d-flex" key={route.path}>
                            <span className="material-icons align-content-center me-1 fs-5">{route.icon}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </header>
        <div className="contentAll pb-5">
            <Outlet />
        </div>
    </>
    )
}
export default FrontLayout;