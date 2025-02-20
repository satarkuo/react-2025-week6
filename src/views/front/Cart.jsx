import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Toast } from '../../utils/sweetAlert';
import ReactLoading from "react-loading";

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;


const Cart = () => {

    //Loading邏輯
    const [isScreenLoading, setIsScreenLoading] = useState(false); //全螢幕Loading
    const [isLoading, setIsLoading] = useState(false); //局部loading
    

    //取得購物車
    const [cartList, setCartList] = useState([]); //購物車list
    const getCartList = async() => {
        setIsScreenLoading(true)
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
            setCartList(res.data.data)
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "取得購物車失敗",
                text: error
            });
        } finally {
            setIsScreenLoading(false)
        }
    }

    //初始化產品列表、購物車列表
    useEffect(() => {
        getCartList();
    }, []);
    
    //購物車：修改單一產品
    const updateCart = async(id, title, qty, color) => {
        if(qty == 0) { 
            deleteCart(id,title) 
            return
        }
        setIsScreenLoading(true)
        const data = { product_id: id, qty:Number(qty), color};
        try {
            await axios.put(`${BASE_URL}/api/${API_PATH}/cart/${id}`, {data})
            Toast.fire({
                icon: "success",
                title: title,
                text: `數量已修改為 ${qty}`
            });
            getCartList();
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "產品數量修改失敗",
                text: error
            });
        } finally {
            setIsScreenLoading(false)
        }
    }
    
    //購物車：刪除單一產品
    const deleteCart = async(id, title) => {
        setIsScreenLoading(true)
        try {
            const res = await axios.delete(`${BASE_URL}/api/${API_PATH}/cart/${id}`)
            Toast.fire({
                icon: "success",
                title: `產品 ${title} 已從購物車移除`,
                text: res.data.message
            });
            getCartList();
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: `產品 ${title} 移除失敗`,
                text: error
            });
        } finally {
            setIsScreenLoading(false)
        }
    }
    //購物車：刪除全部一產品
    const deleteCartAll = async() => {
        setIsLoading(true)
        try {
            const res = await axios.delete(`${BASE_URL}/api/${API_PATH}/carts`)
            Toast.fire({
                icon: "success",
                title: `購物車已清空`,
                text: res.data.message
            });
            getCartList();
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: `購物車清空失敗`,
                text: error
            });
        } finally {
            setIsLoading(false)
        }
    }
    
    //表單邏輯
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: 'onTouched',
    })

    const onSubmit = (data) => {
        //解構出message，並將剩餘物件展開放到user中
        const { message, ...user } = data;
        const userInfo = { user, message };
        checkout(userInfo);
    }

    //送出訂單
    const checkout = async(data) => {
        setIsScreenLoading(true)
        try {
            await axios.post(`${BASE_URL}/api/${API_PATH}/order`, {data} )
            Toast.fire({
                icon: "success",
                title: `訂單已送出`,
                text: `將盡快為您出貨`
            });
            getCartList();
            reset(); //清空表單
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: `訂單送出失敗`,
                text: error
            });
        } finally {
            setIsScreenLoading(false)
        }
    }

    return (
        <>
            <div className="container py-5">
                <section className="cartList py-5 mb-5" id="cartList">
                    <div className="d-flex ">
                        <h1 className="h2 mt-0 text-primary flex-fill">購物車</h1>
                        {cartList.carts?.length >= 1 && 
                            <div className="text-end">
                                <button className="btn btn-primary-outline btn-sm d-inline-flex align-items-center justify-content-center gap-2" type="button"
                                onClick={deleteCartAll} disabled={isLoading}>
                                    <span className="material-icons-outlined align-content-center me-1 fs-6">delete</span>
                                    清空購物車
                                    {isLoading && (
                                        <ReactLoading type={"spin"} color={"#000"} height={"1.2rem"} width={"1.2rem"} />
                                    )}
                                </button>
                            </div>
                        }
                    </div>
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th width='100'>圖示</th>
                                <th>品名</th>
                                <th>顏色</th>
                                <th className="text-end" style={{ width: "200px" }}>數量/單位</th>
                                <th className="text-end">單價</th>
                                <th width='100'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartList.carts?.length >= 1 ? (
                                    cartList.carts?.map(cart => {
                                        return (<tr key={cart.id}>
                                            <td className="px-0">
                                                <img src={cart.product.imageUrl} width="80" className="rounded-3" />
                                            </td>
                                            <td>{cart.product.title}</td>
                                            <td>
                                                <div className="d-flex ">
                                                    <small className="text-secondary align-content-center lh-1">{cart.color.colorName}</small>
                                                    <span className="colorSquare m-0 ms-2" style={{
                                                        'backgroundColor': cart.color.colorCode
                                                        }}></span>
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end align-items-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary-outline btn-sm p-0 ps-2 d-flex rounded-end jystify-content-center"
                                                        style={{ width: "32px", height: '32px' }}
                                                        onClick={()=> updateCart(cart.id, cart.product.title, cart.qty-1, cart.color)}
                                                    >
                                                        <span className="material-icons align-content-center fs-6">remove</span>
                                                    </button>
                                                    <span
                                                        className="text-center border-top border-bottom px-3 py-1" 
                                                        style={{ width: "40px", height: '32px', cursor: "auto" }}
                                                    ><b>{cart.qty}</b></span>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary-outline btn-sm p-0 ps-1 d-flex rounded-start jystify-content-center"
                                                        style={{ width: "32px", height: '32px' }}
                                                        onClick={()=> updateCart(cart.id, cart.product.title, cart.qty+1, cart.color)}
                                                    >
                                                        <span className="material-icons align-content-center fs-6">add</span>     
                                                    </button>
                                                    <span className="input-group-text text-secondary border-0 pe-0">
                                                        {cart.product.unit}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-end">$ {cart.product.price}</td>
                                            <td className="text-end" >
                                                <button type="button" 
                                                    className="btn btn-primary-outline btn-sm px-2 d-inline-flex"
                                                    onClick={()=> deleteCart(cart.id, cart.product.title)}>
                                                    <span className="material-icons align-content-center fs-6">clear</span>
                                                </button>
                                            </td>
                                        </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan='6' className="text-center text-body-tertiary bg-light">購物車沒有商品</td>
                                    </tr>
                                )
                            }
                        
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="4" className="text-end border-0">總計：</td>
                                <td className="text-end border-0" style={{ width: "130px" }}>
                                    <b className="text-primary h5">$ {cartList.carts?.length >= 1 ? cartList.total : 0 }</b>
                                </td>
                                <td className=" border-0"></td>
                            </tr>
                        </tfoot>
                    </table> 
                </section>
                <section className="orderInfo py-5 mb-5">
                    <h1 className="h2 mt-0 text-primary text-center">收件資料</h1>
                    <div className="my-5 row justify-content-center">
                        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input id="email" type="email"
                                    className={`form-control ${errors.email && 'is-invalid' }`}
                                    placeholder="請輸入 Email"
                                    {...register('email', {
                                        required: '請填寫 Email 欄位',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'Email 格式錯誤'
                                        }
                                    })}
                                />
                                {errors.email &&
                                    <p className="text-primary my-2">{errors.email.message}</p>
                                }
                                
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">收件人姓名</label>
                                <input id="name"  type="text"
                                    className={`form-control ${errors.name && 'is-invalid' }`}
                                    placeholder="請輸入姓名"
                                    {...register('name', {
                                        required: '請填寫 姓名 欄位'
                                    })}
                                />
                                {errors.name &&
                                    <p className="text-primary my-2">{errors.name.message}</p>
                                }
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tel" className="form-label">收件人電話</label>
                                <input id="tel" type="tel"
                                    className={`form-control ${errors.tel && 'is-invalid' }`}
                                    placeholder="請輸入電話"
                                    {...register('tel', {
                                        required: '請填寫 電話 欄位',
                                        pattern: {
                                            value: /^(0[2-8]\d{7}|09\d{8})$/,
                                            message: '電話 格式錯誤'
                                        }
                                    })}
                                />
                                {errors.tel &&
                                    <p className="text-primary my-2">{errors.tel.message}</p>
                                }
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">收件人地址</label>
                                <input id="address" type="text"
                                    className={`form-control ${errors.address && 'is-invalid' }`}
                                    placeholder="請輸入地址"
                                    {...register('address', {
                                        required: '請填寫 地址 欄位'
                                    })}
                                />
                                {errors.address &&
                                    <p className="text-primary my-2">{errors.address.message}</p>
                                }
                            </div>
                            <div className="mb-3">
                                <label htmlFor="message" className="form-label">留言</label>
                                <textarea
                                    id="message" className="form-control" cols="30" rows="10"
                                    {...register('message')}
                                ></textarea>
                            </div>
                            <div className="text-end">
                                <button type="submit" className="btn btn-primary" disabled={cartList.carts?.length === 0}>
                                    送出訂單
                                </button>
                            </div>
                        </form>
                    </div>
                </section> 
            </div>
            {isScreenLoading && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(230,146,112,0.7)",
                    zIndex: 1999,
                    }}>
                    <ReactLoading type="spin" color="#fff" width="4rem" height="4rem" />
                </div>
            )}
        </>
    )
}
export default Cart;