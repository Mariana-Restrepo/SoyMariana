import { developer } from '@soymariana/content';
import { seededRotation } from '@soymariana/core';

import { Reveal } from '@/components/brand/Reveal';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Eyebrow, Section } from '@/components/ui/Section';
import { externalProps, safeHref } from '@/lib/utils';

function ProjectLink({ href, children }: { href: string | undefined; children: string }) {
  if (!href)
    return (
      <span className="inline-flex min-h-11 items-center text-ink-soft" title="Enlace pendiente">
        {children}
      </span>
    );
  return (
    <a
      href={href}
      className="inline-flex min-h-11 items-center text-azul underline underline-offset-4"
      {...externalProps(href)}
    >
      {children}
    </a>
  );
}

/** Su segunda capa: cambia el "clima" a azul, sigue siendo ella (misma tipografía y voz). */
export default function DeveloperSection() {
  return (
    <Section id="developer" labelledBy="developer-title" tone="azul">
      <Reveal>
        <Eyebrow>{developer.eyebrow}</Eyebrow>
        <h2 id="developer-title" className="text-h2">
          {developer.title} <em className="text-azul">{developer.titleEmphasis}</em>
        </h2>
        <p className="mt-3.5 max-w-[46ch] text-lead">{developer.intro}</p>
        <ul className="mb-10 mt-5 flex flex-wrap gap-2">
          {developer.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-pill border-[1.5px] border-azul bg-white/55 px-4 py-1.5 text-[0.9rem] font-normal text-azul"
              style={{ rotate: `${seededRotation(skill, 1.5)}deg` }}
            >
              {skill}
            </li>
          ))}
        </ul>
      </Reveal>

      <ul className="grid gap-[18px] md:grid-cols-3">
        {developer.projects.map((project, i) => (
          <li key={project.id}>
            <Reveal index={i} className="h-full">
              <article className="h-full rounded-lg bg-white p-3 pb-5 shadow-blue transition duration-500 ease-out-soft hover:-translate-y-1.5">
                <MediaFrame
                  image={project.image}
                  className="mb-3.5 aspect-[16/10] rounded-md"
                  sizes="(min-width: 768px) 30vw, 90vw"
                />
                {project.badge && (
                  <p className="mx-1.5 mb-1 font-hand text-[1.1rem] leading-none text-cereza-ink">
                    {project.badge}
                  </p>
                )}
                <h3 className="mx-1.5 mb-1 text-[1.55rem] leading-tight">{project.name}</h3>
                <p className="mx-1.5 mb-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
                  {project.description}
                </p>
                <ul className="mx-1.5 mb-3.5 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-pill bg-azul-tint px-3 py-1 text-[0.72rem] font-medium text-azul"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                <div className="mx-1.5 flex gap-4 text-[0.88rem] font-medium">
                  <ProjectLink href={safeHref(project.githubUrl)}>GitHub ↗</ProjectLink>
                  {project.demoUrl && (
                    <ProjectLink href={safeHref(project.demoUrl)}>Demo ↗</ProjectLink>
                  )}
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
