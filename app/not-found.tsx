import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div className="text-7xl font-semibold tracking-tighter text-gradient-brand sm:text-8xl">
        404
      </div>
      <h1 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
        No encontramos esta página
      </h1>
      <p className="mt-3 max-w-sm text-sm text-[var(--color-tinta-suave)]">
        Puede que el enlace esté roto o que la página se haya movido. Volvé al inicio o escribinos por
        WhatsApp.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button href="/" variant="primary" icon="arrow" iconRight>
          Volver al inicio
        </Button>
        <Button href="/tiendas" variant="outline" icon="store">
          Ver tiendas
        </Button>
      </div>
    </Container>
  );
}
