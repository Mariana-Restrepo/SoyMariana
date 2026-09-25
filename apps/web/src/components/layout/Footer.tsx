import { links, profile } from '@soymariana/content';

import { externalProps, safeHref, safeMailto } from '@/lib/utils';

/** Enlace a una red o al correo; si todavía es un [PLACEHOLDER], se muestra sin ser link. */
function SocialLink({
  href,
  children,
  label,
}: {
  href: string | undefined;
  children: string;
  label: string;
}) {
  if (!href) {
    return (
      <span
        className="underline decoration-dotted underline-offset-4"
        title={`${label}: enlace pendiente`}
      >
        {children}
      </span>
    );
  }
  return (
    <a href={href} className="underline underline-offset-4" {...externalProps(href)}>
      {children}
    </a>
  );
}

export function Footer() {
  const tiktok = safeHref(links.tiktok.url);
  const email = safeMailto(links.email);
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="bg-rosa pb-8 pt-[clamp(3rem,8vw,5.5rem)]">
      <div className="wrap">
        <p className="font-serif text-huge">
          <em className="text-[0.9em]">Soy</em> Mariana
        </p>

        <div className="mt-9 grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <h2 className="mb-2.5 font-sans text-eyebrow font-medium uppercase tracking-[0.14em]">
              {profile.fullName}
            </h2>
            <p>{profile.role}.</p>
            <p className="mt-4">
              TikTok:{' '}
              <SocialLink href={tiktok} label="TikTok">
                {links.tiktok.handle}
              </SocialLink>
              <br />
              Correo:{' '}
              <SocialLink href={email} label="Correo">
                {links.email}
              </SocialLink>
            </p>
          </div>

          <nav aria-label="Redes y contacto">
            <h2 className="mb-2.5 font-sans text-eyebrow font-medium uppercase tracking-[0.14em]">
              Encuéntrame
            </h2>
            <ul className="space-y-1">
              <li>
                <SocialLink href={tiktok} label="TikTok">
                  TikTok
                </SocialLink>
              </li>
              <li>
                <SocialLink href={email} label="Correo">
                  Correo
                </SocialLink>
              </li>
            </ul>
          </nav>

          <p className="max-w-[26ch] font-serif text-[clamp(1.4rem,3.4vw,2rem)] italic leading-tight">
            {profile.closing}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-x-6 gap-y-1.5 border-t border-ink/25 pt-5 text-[0.85rem]">
          <span>
            © {year} {profile.fullName}
          </span>
          <span>Hecho con cariño ♡</span>
        </div>
      </div>
    </footer>
  );
}
