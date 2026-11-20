import { useState } from 'react';

function NameInput() {
    const [name, setName] = useState('');

    return (
        <>
            <input 
                value = {name}
                onChange={ (e) => {
                    console.log(e.target.value);
                    setName(e.target.value);}}
            />
            <p>안녕하세요, {name}님!</p>
        </>
    );
}

export default NameInput;