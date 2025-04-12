import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {getUser} from "../../http/authApi";
import './PaymentHistory.css';


const PaymentHistory = observer(() => {
    const [payments, setPayments] = useState<{ amount: number, createdAt: string }[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            if (user?._paymentHistory) {
                setPayments(user._paymentHistory);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="payment-history-container">
            <h2 className="payment-title">💳 History Payments</h2>
            <div className="table-wrapper">
                <table className="payment-table">
                    <thead>
                    <tr>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.map((payment, index) => (
                        <tr key={index}>
                            <td>{payment.amount.toFixed(2)} ₽</td>
                            <td>{new Date(payment.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default PaymentHistory;
