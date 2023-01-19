import React from 'react'
import { useState, useEffect } from "react";

function Connect() {
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            setInstalled(true);
        }    
    }, [])
    
  return (
    <>
        {
        installed ? 
            <div>Installed</div>
            :
            <div>Not installed</div>
        }
    </>
  )
}

export default Connect