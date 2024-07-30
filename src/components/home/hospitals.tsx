import Image from "next/image";

const logos = [...new Array(8)].map((client, index) => ({
  href: `/logos/${index + 1}.png`,
}));

const HospitalGrid = () => (
  <main className="py-16 lg:py-20">
    <div className="custom-screen">
      <h2 className="font-semibold text-sm text-gray-800 text-center">
        Con la confianza de los hospitales más grandes
      </h2>
      <div className="mt-8 flex justify-center">
        <ul className="inline-grid grid-cols-2 gap-x-10 gap-y-8 md:gap-x-16 md:grid-cols-3 lg:grid-cols-4">
          {logos.map((item, idx) => (
            <li key={idx}>
              <Image
                src={item.href}
                alt={item.href}
                width={150}
                height={100}
                className="invert"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="custom-screen text-center pt-16 lg:pt-20">
      <div className="max-w-xl mx-auto">
        <h2 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
          Te ayudamos en los requerimientos que necesites.
        </h2>
        <p className="mt-3 text-gray-600">
          Como empresa de Ingeniería y Tecnología Médica, estamos comprometidos
          con el bienestar y la salud de nuestra comunidad.
        </p>
      </div>
    </div>
  </main>
);

export default HospitalGrid;
