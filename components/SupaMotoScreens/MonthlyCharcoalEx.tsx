import React, { useEffect, useState } from 'react'
import Charcoal from '@icons/charcoal.svg';
import styles from './SupaMotoScreens.module.scss';
import IconText from '@components/IconText/IconText';
import { useRenderScreen } from '@hooks/useRenderScreen';
import MonthlyCharcoal from './MonthlyCharcoal';
import StoveUsage from './StoveUsage';
import Footer from '@components/Footer/Footer';

const MonthlyCharcoalEx = () => {
    const [amount, setAmount] = useState(0);
    const { currentScreen, switchToScreen } = useRenderScreen('monthly_charcoal_ex');

    useEffect(() => {
        const monthlyCharcoal = localStorage.getItem('monthlyCharcoalExpense');
        if (monthlyCharcoal) {
            setAmount(parseInt(monthlyCharcoal, 10));
        }
    }, []);

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newAmount = parseInt(event.target.value, 10);
        newAmount = Math.min(newAmount, 5000);
        setAmount(newAmount);
        localStorage.setItem('monthlyCharcoalExpense', newAmount.toString());
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case 'monthly_charcoal_ex':
                return (
                    <div className={styles.onboardingComponent} >
                        <IconText title='Monthly Charcoal Expenses' Img={Charcoal} imgSize={30} />
                        <div className={styles.incomeOutput} >
                            <label className={styles.incomeInput} >{amount} KES</label>
                        </div>
                        <div className={styles.table} >
                            <input
                                className={styles.monthlyIncome}
                                type="range"
                                id="amount"
                                name="amount"
                                min="0"
                                max="5000"
                                step="100"
                                value={amount}
                                onChange={handleAmountChange}
                            />
                        </div>
                        <Footer onBack={routeBack} onBackUrl='/' onForward={switchRoute} />
                    </div>
                )
            case 'stove_usage':
                return <StoveUsage />;
            case 'previous_route':
                return <MonthlyCharcoal />
            default:
                return <>Empty</>;
        }
    }

    const switchRoute = () => {
        switchToScreen('stove_usage');
    };
    const routeBack = () => {
        switchToScreen('previous_route');
    };


    return renderScreen()
}

export default MonthlyCharcoalEx;
