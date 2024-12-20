import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentComponent = ({ setPaymentId }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const amount = location.state?.amount || 0; // Default to 0 if no amount is passed
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                if (window.Razorpay) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve();
                script.onerror = () => {
                    setError("Failed to load Razorpay SDK. Please try again later.");
                };
                document.body.appendChild(script);
            });
        };

        const handlePayment = async () => {
            setError(null);
            setIsLoading(true);

            try {
                await loadRazorpayScript();

                const options = {
                    key: 'rzp_test_W1Q8BUqjEuknLa', // Replace with your Razorpay Key ID
                    amount: amount * 100, // Amount in paise (Razorpay expects amount in paise)
                    currency: 'INR',
                    name: 'SaloonIT',
                    description: 'Payment For Hair Saloon Services',
                    handler: function (response) {
                        setPaymentId(response.razorpay_payment_id); // Set the payment ID
                        console.log('Payment successful:', response);
                        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                        
                        // Redirect to success page and pass paymentId in state
                        navigate('/payment-success', {
                            state: { paymentId: response.razorpay_payment_id }
                        });
                    },
                    prefill: {
                        name: 'Customer Name',
                        email: 'customer@example.com',
                        contact: '9999999999',
                    },
                    theme: {
                        color: '#F37254',
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.on('payment.failed', (response) => {
                    console.error('Payment failed:', response.error);
                    setError("Payment failed. Please try again.");
                });

                razorpay.open();
            } catch (err) {
                console.error("Error in payment process:", err);
                setError("An unexpected error occurred. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        handlePayment();
    }, [amount, navigate, setPaymentId]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            {isLoading ? (
                <div>
                    <h2>Processing Payment...</h2>
                    <p>Amount: ₹{amount}</p>
                </div>
            ) : (
                <div>
                    {error ? (
                        <div style={{ color: 'red', marginTop: '20px' }}>
                            <h3>Error</h3>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <h2>Payment initialized. Follow the Razorpay popup to complete your payment.</h2>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentComponent;