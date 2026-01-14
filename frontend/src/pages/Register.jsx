import React, { useState } from 'react';
import Login from './Login';

const Register = () => {
    // We can just reuse the Login component but set it to register mode by default if we want,
    // or just let it handle it. For now, since Login.jsx has the toggle, 
    // we can just use it and potentially pass a prop.
    // However, Login.jsx doesn't take props for initial state yet.
    // Let's modify Login.jsx to accept initialIsLogin prop.
    return <Login initialIsLogin={false} />;
};

export default Register;
