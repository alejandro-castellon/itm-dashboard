import Image from "next/image";
import NavLink from "@/components/ui/home/navlink";

const Productos = () => {
  return (
    <main id="productos" className="overflow-hidden py-16 lg:py-20 ">
      <div className="custom-screen flex flex-col-reverse gap-x-12 justify-between md:flex-row md:items-center">
        <div className="flex-none max-w-xl mt-12 space-y-3 md:mt-0">
          <h2 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
            Realizamos AUTOCLAVES de acuerdo a tus necesidades.
          </h2>
          <p className="text-gray-600">
            Las autoclaves son dispositivos esenciales en laboratorios,
            hospitales y entornos industriales para la esterilización de equipos
            y materiales. Utilizan vapor de agua a alta presión y temperatura
            para eliminar microorganismos, garantizando un entorno seguro y
            libre de contaminantes.
          </p>
          <div className="pt-1">
            <NavLink
              href="/404"
              className="inline-flex items-center gap-x-2 font-medium text-sm text-white bg-sky-500 hover:bg-blue-500 active:bg-blue-700 "
            >
              Ver Productos
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </NavLink>
          </div>
        </div>
        <div className="flex-none w-full md:max-w-xl">
          <Image
            src="/autoclave.jpg"
            alt="autoclave"
            className="w-full shadow-lg rounded-lg border"
            width={500}
            height={500}
          />
        </div>
      </div>
    </main>
  );
};

export default Productos;
