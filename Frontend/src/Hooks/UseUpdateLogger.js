import { useEffect, useState } from 'react'
import Logger from '../utils/logger';

export default function UseUpdateLogger(title) {
    useEffect(() => {
        Logger.log('UseUpdateLogger:', title);
    }, [title])
}
