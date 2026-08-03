import { LinksEditor } from "@/components/admin/LinksEditor";

export default function AdminFooterPage() {
  return (
    <>
      <h1 className="mb-2 font-display text-2xl font-bold">Footer</h1>
      <p className="mb-8 text-sm text-nasah-gray">
        Every footer column and the social links at the bottom.
      </p>
      <LinksEditor group="footer_products" title="Products column" />
      <LinksEditor group="footer_developers" title="Developers column" />
      <LinksEditor group="footer_company" title="Company column" />
      <LinksEditor group="footer_legal" title="Legal column" />
      <LinksEditor group="social" title="Social links" />
    </>
  );
}
