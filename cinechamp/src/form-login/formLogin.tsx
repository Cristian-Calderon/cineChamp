import React from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
};

const formLogin: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Datos enviados:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 max-w-md mx-auto border rounded-lg shadow-md">
      <h2 className="text-lg font-bold">Registro</h2>

      <div>
        <label className="block text-sm">Nombre:</label>
        <input {...register("name", { required: "El nombre es obligatorio" })} className="w-full border p-2 rounded" />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm">Correo:</label>
        <input {...register("email", { required: "El correo es obligatorio", pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo inválido" } })} className="w-full border p-2 rounded" />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Enviar</button>
    </form>
  );
};

export default formLogin;
