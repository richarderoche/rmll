# Remove Projects Starter Feature

This starter template ships with a sample `project` document type, a `/projects/[slug]` route, and a home page showcase grid. Some websites won't need these. Follow this checklist when asked to remove this document and route.

## 1. Sanity schema — remove document type

- [ ] Delete `studio/schemaTypes/documents/project.ts`
- [ ] Update `studio/schemaTypes/index.ts`:
  - Remove `import project from './documents/project'`
  - Remove `project` from the `schemaTypes` array

"Project" will disappear from Studio's document list automatically (structure uses `S.documentTypeListItems()` — no structure config changes needed).

## 2. Sanity schema — remove references in blocks/objects

### Home singleton

- [ ] Update `studio/schemaTypes/singletons/home.ts`: remove the entire `showcaseProjects` field (array of references to `project`).

### Navigation / page-builder links

- [ ] Update `studio/schemaTypes/objects/navPage.ts`: change the `page` reference `to` array from:

  ```ts
  to: [{type: 'home'}, {type: 'page'}, {type: 'project'}]
  ```

  to:

  ```ts
  to: [{type: 'home'}, {type: 'page'}]
  ```

This affects header/footer nav (via `navLinks` in settings) and page-builder buttons (via `pbBlockButton.sitePage`). No direct edits needed in those files.

Portable text internal links (`ptBasic`, `ptSlim`, `ptSingle`) only reference `page` — no changes needed there.

## 3. Frontend — delete route and components

- [ ] Delete `frontend/app/projects/` (the entire route directory)
- [ ] Delete `frontend/components/ProjectListItem.tsx` (only used by the home page showcase grid)

## 4. Frontend — update queries and routing helpers

### GROQ queries (`frontend/sanity/lib/queries.ts`)

- [ ] Remove the `showcaseProjects[]{ ... }` block from `homePageQuery`
- [ ] Delete `projectBySlugQuery` entirely
- [ ] Keep `slugsByTypeQuery` and `sitemapByTypeQuery` — they are generic

### Route resolver (`frontend/sanity/lib/utils.ts`)

- [ ] Remove the `case 'project':` branch from `resolveHref()`

`resolveHref` is also used by `NavLinks.tsx`, `Button.tsx`, and `CustomPortableText.tsx` — no edits needed in those files once the case is removed.

## 5. Frontend — update pages

### Home page (`frontend/app/page.tsx`)

- [ ] Remove `ProjectListItem` import
- [ ] Remove `resolveHref`, `Link`, `SiteGrid`, `SiteWidth`, `studioUrl`, and `createDataAttribute` imports if no longer used
- [ ] Remove `showcaseProjects` destructuring and the entire showcase grid JSX block

### Sitemap (`frontend/app/sitemap.ts`)

- [ ] Remove the `projects` `sanityFetch` call
- [ ] Remove the `projects.data.map(...)` block

## 6. Regenerate schema and TypeGen artifacts

From the repo root:

```bash
npm run sanity:typegen --workspace=frontend
npm run sanity:typegen --workspace=studio
```

This re-extracts `sanity.schema.json` and regenerates `frontend/sanity.types.ts` and `studio/sanity.types.ts`.

## 7. Sanity dataset content cleanup

Removing the schema does **not** delete existing documents or field data. Clean up content so editors don't see broken references:

- [ ] **Home document**: clear `showcaseProjects` (or remove via migration once schema is updated)
- [ ] **Settings nav**: audit header/footer nav items — re-point or delete any `navPage` pointing at a `project`
- [ ] **Page builder buttons**: audit pages for `pbBlockButton` blocks with `sitePage.page` referencing a project
- [ ] **Delete project documents** (optional): remove all `*[_type == "project"]` documents if no longer needed

Audit queries (Vision tool or CLI):

```groq
// Nav links pointing at projects
*[_type == "settings"][0]{
  "header": headerNav.navItems[page._type == "project"].page->{title, "slug": slug.current},
  "footer": footerNav.navItems[page._type == "project"].page->{title, "slug": slug.current}
}

// Home showcase references
*[_type == "home"][0].showcaseProjects[]->

// All project docs
*[_type == "project"]{_id, title, "slug": slug.current}
```

## 8. Verification

- [ ] `npm run type-check --workspaces` passes
- [ ] `npm run lint --workspace=frontend` passes
- [ ] Studio loads without schema errors; "Project" type is gone
- [ ] Home page renders without showcase section
- [ ] `/projects/any-slug` returns 404
- [ ] Sitemap no longer includes `/projects/*` URLs
- [ ] Nav links and page-builder buttons previously pointing at projects are fixed in Studio
- [ ] Visual editing / presentation preview still works for `home` and `page`

## Note: `projectId` is not the document type

`projectId` in env files and config (`frontend/sanity/lib/api.ts`, `client.ts`, `sanity.config.ts`, etc.) is the Sanity **API project ID**, not the `project` document type. Leave those as-is.
