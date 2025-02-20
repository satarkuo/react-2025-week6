import { useState, useEffect, useRef } from 'react'
import { Modal } from 'bootstrap';
import { Toast } from '../utils/sweetAlert';
import axios from 'axios';
import ReactLoading from "react-loading";
import PropTypes from 'prop-types'; 

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

function DeleteProductModal({
        tempModalData,
        getProductsList,
        setTempModalData,
        defaultData,
        isOpen,
        setIsOpen
    }){

    const deleteProductModalRef = useRef(null);
    useEffect(() => {
        const modalInstance = Modal.getOrCreateInstance(deleteProductModalRef.current);

        deleteProductModalRef.current.addEventListener('hidden.bs.modal', () => {
            document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
        });

    
    }, [])

    useEffect(() => {

        if(isOpen) {
            const modalInstance = Modal.getOrCreateInstance(deleteProductModalRef.current);
            modalInstance.show();

            // 將焦點設置到模態框內的第一個可聚焦元素
            setTimeout(() => {
                const title = document.querySelector('.modal-title');
                if (title) {
                    title.focus();
                }
            }, 150)
        } 
    },[isOpen])

    //刪除產品
    const deleteProduct = async () => {
        try {
            await axios.delete(`${BASE_URL}/api/${API_PATH}/admin/product/${tempModalData.id}`)
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "刪除產品失敗",
                text: error.response.data.message
            });
        }
    }
  
    // modal送出確認：刪除產品
    const [isLoading, setIsLoading] = useState(false); //局部loading
    const handleDeleteProduct = async () => {
        setIsLoading(true)
        try {
            await deleteProduct();
            getProductsList();
            closeDeleteProductModal();
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "刪除產品失敗",
                text: error.response.data.message
            });
        } finally {
            setIsLoading(false)
        }
    }

    //關閉modal：刪除產品
    const closeDeleteProductModal = () => {
        const modalInstance = Modal.getInstance(deleteProductModalRef.current) //取得modal
        modalInstance.hide();
        document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
        setIsOpen(false);
        setTempModalData(defaultData); //清空產品資料，避免影響下一步動作
        // 移除模態框焦點並將焦點設置到其他地方
        const triggerButton = document.querySelector('.btn-delete-outline'); // 修改為觸發模態框的按鈕選擇器
        if (triggerButton) {
            triggerButton.focus(); // 將焦點移到觸發按鈕
        }
    }

    return (
        <div className="modal fade" tabIndex="-1" ref={deleteProductModalRef} id="delProductModal">
            <div className="modal-dialog ">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" tabIndex="0">刪除產品</h5>
                        <button type="button" className="btn-close" onClick={closeDeleteProductModal}></button>
                    </div>
                    <div className="modal-body">
                        是否刪除產品 <span className="text-danger fw-bold">{tempModalData.title}</span>
                    </div>
                    <div className="modal-footer">
                        <button type="button" disabled={isLoading}
                            className="btn btn-delete d-flex align-items-center justify-content-center gap-2" 
                            onClick={handleDeleteProduct}>
                            刪除
                            {isLoading && (
                                <ReactLoading type={"spin"} color={"#000"} height={"1.2rem"} width={"1.2rem"} />
                            )}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={closeDeleteProductModal}>取消</button>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default DeleteProductModal;
DeleteProductModal.propTypes = {
    tempModalData: PropTypes.object.isRequired,
    getProductsList: PropTypes.func.isRequired,
    setTempModalData: PropTypes.func.isRequired,
    defaultData: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired
}