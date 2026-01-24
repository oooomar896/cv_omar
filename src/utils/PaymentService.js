/**
 * Payment Service - محاكاة ومعالجة المدفوعات
 */

export const PAYMENT_METHODS = {
    VISA: { id: 'visa', name: 'Visa', icon: '💳' },
    MASTERCARD: { id: 'mastercard', name: 'MasterCard', icon: '💳' },
    MADA: { id: 'mada', name: 'Mada', icon: '🏛️' },
    APPLE_PAY: { id: 'apple', name: 'Apple Pay', icon: '🍎' }
};

class PaymentService {
    /**
     * مبادرة عملية الدفع
     * @param {number} amount القيمة
     * @param {string} method طريقة الدفع (visa, mada, etc)
     * @param {string} projectId معرف المشروع (اختياري)
     */
    async initiatePayment(amount, method, projectId = null) {
        console.log(`Initialing payment: ${amount} SAR via ${method}`);

        // في المستقبل، هذا الاتصال سيذهب إلى Edge Function
        // const { data, error } = await supabase.functions.invoke('create-payment', { ... });

        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 2000));

        // محاكاة النجاح بنسبة 90%
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
            return {
                success: true,
                transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
                amount: amount,
                date: new Date().toISOString(),
                method: method
            };
        } else {
            throw new Error('فشلت عملية الدفع. يرجى التحقق من البطاقة أو المحاولة لاحقاً.');
        }
    }

    validateCard(number) {
        // Luhn Algorithm simplified
        return number.length >= 16;
    }
}

export const paymentService = new PaymentService();
