import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import Camera from '@icons/camera.svg';
import ProfilePic from '@icons/profilepic.svg';
import IconText from '@components/IconText/IconText';
import styles from './SupaMotoScreens.module.scss';
import Coordinates from './Coordinates';
import Footer from '@components/Footer/Footer';
import useWindowDimensions from '@hooks/useWindowDimensions';
import { useRenderScreen } from '@hooks/useRenderScreen';
import { StepConfigType, StepDataType, STEPS } from 'types/steps';
import CustomCamera from '@components/CustomCamera/CustomCamera';
import Header from '@components/Header/Header';
import Village from './Village';
import Customer from '@icons/customer.svg';
import PrivacyPolicy from './PrivacyPolicy';
import CustomerIdBack from './CustomerIdBack';

type GetCameraImageProps = {
    onSuccess: (data: StepDataType<STEPS.get_camera_image>) => void;
    onBack?: () => void;
    data?: StepDataType<STEPS.get_camera_image>;
    config: StepConfigType<STEPS.get_camera_image>;
    Width?: number;
    Height?: number;
    header?: string;
};

const ProfilePicture: FC<GetCameraImageProps> = ({ onSuccess, onBack, Width, Height, header }) => {
    const { currentScreen, switchToScreen } = useRenderScreen('profile_picture');
    const [frame, setFrame] = useState({ width: 0, height: 0 });
    const [capturedData, setCapturedData] = useState<{
        image: string | null,
        height: number,
        width: number
    }>({ image: null, height: 0, width: 0 });
    const cameraRef = useRef<any>();
    const { width, height, footerHeight, headerHeight } = useWindowDimensions();

    useEffect(() => {
        return () => cameraRef.current?.stopCamera();
    }, []);

    useEffect(() => {
        if (width && height) {
            const screenWidth = width ?? 250;
            const screenHeight = (height ?? 300) - footerHeight - headerHeight;
            setFrame({
                width: Width && Width <= screenHeight ? Width : screenWidth,
                height: Height && Height <= screenHeight ? Height : screenHeight,
            });
        }
    }, [width, height, footerHeight, headerHeight]);

    const renderScreen = () => {
        switch (currentScreen) {
            case 'profile_picture':
                return (
                    <div className={styles.onboardingComponent} >
                        <IconText title='' Img={Camera} imgSize={50} />
                        <div className={styles.table} >
                            <IconText
                                title='Profile Picture'
                                Img={ProfilePic}
                                imgSize={150} />
                        </div>
                        <Footer onBack={routeBack} onBackUrl='/' onForward={switchRoute} />
                    </div>
                )
            case 'camera':
                return (
                    <>
                        <Header header={header} />
                        <main style={{ top: '-60px', position: 'relative' }} >
                            <div className={styles.table}>
                                <CustomCamera
                                    width={width ?? 250}
                                    height={(height ?? 300) - footerHeight - headerHeight}
                                    frameWidth={205}
                                    frameHeight={201}
                                    ref={cameraRef}
                                />
                            </div>
                        </main>
                        <Footer onBack={routeBack} onBackUrl={onBack ? undefined : ''} onForward={onSubmit} forwardIcon={Camera} />
                    </>
                )
            case 'profile_photo_verification':
                return (
                    <div className={styles.onboardingComponent} >
                        <IconText title='' Img={Customer} imgSize={30} />
                        <div className="div">
                            <div style={{
                                display: 'flex', justifyContent: 'center', alignItems: 'center'
                            }} >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '200px', width: '200px', borderStyle: 'solid', borderRadius: '5px', borderColor: '#E0A714'
                                }}>
                                    <img src={capturedData.image} alt="Captured Image" width="200" height="200" style={{ borderRadius: '5px' }} />
                                </div>
                            </div>
                            <p style={{ textAlign: 'center' }} >Is the front side photo ok?</p>
                        </div>
                        <Footer onBack={routeBack} onBackUrl='/' onForward={switchRoute1} />
                    </div>
                )
            case 'coordinates':
                return <Coordinates />
            case 'previous_route':
                return <CustomerIdBack />
        }
    }

    const onSubmit = useCallback(() => {
        const imageSrc = cameraRef.current.captureImage();
        if (imageSrc) {
            const result = { image: imageSrc, height: frame.height, width: frame.width };
            localStorage.setItem('profilePicture', result.image);
            setCapturedData(result);
        }
        switchToScreen('profile_photo_verification');
    }, [cameraRef, frame]);

    const switchRoute = () => {
        switchToScreen('camera');
    };

    const switchRoute1 = () => {
        switchToScreen('coordinates');
    };

    const routeBack = () => {
        switchToScreen('previous_route');
    };

    return renderScreen();
}

export default ProfilePicture
