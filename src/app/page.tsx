import Navbar from "@/components/home/navbar";
import Hero from "@/components/home/hero";
import HospitalGrid from "@/components/home/hospitals";
import Servicios from "@/components/home/servicios";
import Productos from "@/components/home/productos";
import Footer from "@/components/home/footer";
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HospitalGrid />
      <Servicios />
      <Productos />
      <Footer />
    </main>
  );
}
