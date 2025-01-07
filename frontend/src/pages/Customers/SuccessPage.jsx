import React, { useEffect } from 'react';
import { useSearchParams, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUpdateOrderToPaidMutation } from '../../redux/api/stripeApiSlice';
import { useDispatch } from 'react-redux';
import { clearCartItems } from '../../redux/features/cart/cartSlice';


const SuccessPage = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id'); // Stripe session ID
    const orderId = searchParams.get('order_id'); // Extract orderId
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [updateOrderToPaid, { isLoading, isError, isSuccess }] = useUpdateOrderToPaidMutation();

    useEffect(() => {
        const markOrderAsPaid = async () => {
            try {
                // Call the backend to mark the order as paid
                await updateOrderToPaid(orderId).unwrap();
                dispatch(clearCartItems());
                toast.success('Order paid successfully!');
                navigate('/customer/orders');
            } catch (error) {
                toast.error('Failed to update the order as paid.');
            }
        };

        if (orderId) {
            markOrderAsPaid();
        }
    }, [orderId, updateOrderToPaid]);

    return (
        <div className="success-page">
            <h1>Payment Successful!</h1>
            <p>Thank you for your payment. Your order ID is: {orderId}</p>
            <p>You can now enjoy your purchase.</p>
        </div>
    );
};

export default SuccessPage;