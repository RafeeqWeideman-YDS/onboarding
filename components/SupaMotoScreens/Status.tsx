import React, { useEffect, useState } from 'react'
import Single from '@icons/single.svg';
import SingleWhite from '@icons/single_white.svg';
import Married from '@icons/married.svg';
import MarriedWhite from '@icons/married_white.svg';
import HouseHoldSvg from '@icons/household.svg';
import styles from './SupaMotoScreens.module.scss';
import IconText from '@components/IconText/IconText';
import { useRenderScreen } from '@hooks/useRenderScreen';
import MonthlyIncome from './MonthlyIncome';
import Footer from '@components/Footer/Footer';
import Gender from './Gender';

const Status = () => {
    const [status, setStatus] = useState('');
    const [usage, setUsage] = useState("");
    const { currentScreen, switchToScreen } = useRenderScreen('status');

    useEffect(() => {
        const selectedStatus = localStorage.getItem('selectedStatus');
        if (selectedStatus) {
            setStatus(selectedStatus);
            setUsage(selectedStatus === 'single' ? 'Single' : 'Married');
        }
    }, []);

    const handleStatusChange = (newStatus: React.SetStateAction<string>) => {
        if (typeof newStatus === 'string') {
            setStatus(newStatus);
            localStorage.setItem('selectedStatus', newStatus);
            setUsage(usage === 'Single' ? 'Married' : 'Single');
        } else if (typeof newStatus === 'function') {
            setStatus((prevStatus) => {
                const newStatusValue = newStatus(prevStatus);
                localStorage.setItem('selectedStatus', newStatusValue);
                return newStatusValue;
            });
        }
    };


    const renderScreen = () => {
        switch (currentScreen) {
            case 'status':
                return (
                    <div className={styles.onboardingComponent} >
                        <IconText title='Status' Img={HouseHoldSvg} imgSize={30} />
                        <div className={styles.table} >
                            <p style={{ color: '#E0A714' }} >{usage}</p>
                        </div>
                        <div className={styles.statusContainer} >
                            <button
                                className={styles.statusBtn}
                                style={{ backgroundColor: status === 'married' ? '#E0A714' : '#F0F0F0' }}
                                onClick={() => handleStatusChange('married')}
                            >
                                {status === 'married' ? (
                                    <MarriedWhite style={{ width: '40px', height: '40px' }} />
                                ) : (
                                    <Married style={{ width: '40px', height: '40px' }} />
                                )}
                            </button>
                            <button
                                className={styles.statusBtn}
                                style={{ backgroundColor: status === 'single' ? '#E0A714' : '#F0F0F0' }}
                                onClick={() => handleStatusChange('single')}
                            >
                                {status === 'single' ? (
                                    <SingleWhite style={{ width: '40px', height: '40px' }} />
                                ) : (
                                    <Single style={{ width: '40px', height: '40px' }} />
                                )}
                            </button>
                        </div>
                        <Footer onBack={routeBack} onBackUrl='/' onForward={switchRoute} />
                    </div>
                )
            case 'monthly_income':
                return <MonthlyIncome />;
            case 'previous_route':
                return <Gender />
            default:
                return <>Empty</>;
        }
    }

    const switchRoute = () => {
        switchToScreen('monthly_income');
    };
    const routeBack = () => {
        switchToScreen('previous_route');
    };

    return renderScreen()
}

export default Status
