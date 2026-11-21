function Avatar({ foto, nome, tamanho = "w-36 h-36" }) {
    if (foto) {
        return (
            <img
                src={foto}
                alt="Foto de perfil"
                className={`${tamanho} rounded-full object-cover border`}
            />
        );
    }

    return (
        <div className={`${tamanho} rounded-full bg-gray-200 flex items-center justify-center text-5xl font-bold text-gray-500`}>
            {nome?.charAt(0).toUpperCase()}
        </div>
    );
}

export default Avatar;