import { useState } from "react";
import { Pencil } from "lucide-react";
import Avatar from "./Avatar";

function InputFotoPerfil({ fotoAtual, nome, aoSelecionar }) {
    const [previa, setPrevia] = useState(null);

    function selecionar(e) {
        const arquivo = e.target.files[0] || null;
        console.log("arquivo:", arquivo);
        aoSelecionar(arquivo);

        if (!arquivo) {
            setPrevia(null);
            return;
        }

        const leitor = new FileReader();
        leitor.onloadend = () => {
            console.log("previa gerada:", leitor.result?.slice(0, 30));
            setPrevia(leitor.result);
        };
        leitor.readAsDataURL(arquivo);
    }

    console.log("render previa:", previa ? "tem" : "vazia");

    return (
        <div className="mt-4 flex justify-center">
            <div className="relative w-36 h-36">
                <Avatar foto={previa || fotoAtual} nome={nome} />

                <label
                    htmlFor="foto_perfil"
                    title="Alterar foto"
                    className="absolute bottom-1 right-1 bg-white border rounded-full p-2 shadow cursor-pointer hover:bg-gray-100"
                >
                    <Pencil size={16} />
                </label>

                <input
                    id="foto_perfil"
                    name="foto_perfil"
                    type="file"
                    accept="image/*"
                    onChange={selecionar}
                    className="hidden"
                />
            </div>
        </div>
    );
}

export default InputFotoPerfil;