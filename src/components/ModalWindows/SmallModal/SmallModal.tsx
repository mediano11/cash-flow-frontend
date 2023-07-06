import CloseButton from '@components/Buttons/CloseButton/CloseButton';
import React, {FC, SetStateAction, Dispatch, useRef, ReactNode, useState, useEffect} from 'react';
import { useOnClickOutside } from 'usehooks-ts'
//UI
import classes from './SmallModal.module.css';

interface ISmallModalProps {
    active: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
    children: ReactNode,
    title: string;
    className: string,
    buttonRef?: React.RefObject<HTMLElement>
}
const SmallModal: FC<ISmallModalProps> = ({ active, setActive, children, className, title, buttonRef }) => {
    const [isFadeOut, setIsFadeOut] = useState<boolean>(false)
    const ref = useRef(null);
    useOnClickOutside(ref, (event) => {
        if (buttonRef) {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node))
                setActive(false)
        } else {
            setActive(false)
        }
    })
    useEffect(() => {
        if (!active)
            setIsFadeOut(true) 
    }, [active])
    // const handleButtonClick = (newVisibility: boolean) => {
    //     if (newVisibility) {
    //         setActive(true)
    //     } else {
    //         setIsFadeOut(true)
    //     }
    // }
    const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
        if (e.animationName === 'fadeOut') { 
            setActive(false)
            setIsFadeOut(false)
            console.log(1);
        }
    }
    const handleCloseModal = () => { 
        // if (active)
            setActive(false)
    }
    return (
        <>
            {active && 
                <div
                    className={`${className ? className : ''} + ${isFadeOut ? `${classes.modal} ${classes.cardFadeOut}` : classes.modal}`}
                    onClick={(e) => e.stopPropagation()}
                    onAnimationEnd={handleAnimationEnd}
                    ref={ref}>
                    <div className={classes.modalHeader}>
                        <h5 className={classes.title}>{title}</h5>
                        <CloseButton size={24} closeHandler={() => { setActive(false) }} />
                    </div>
                    <div className={classes.modal__content}>
                        {children}
                    </div>
                </div>}
        </>
    );
};

export default SmallModal;