import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  robots: { index: false },
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="container-lux pt-36 pb-20 max-w-3xl">
        <h1 className="font-serif text-5xl font-normal mb-12">
          Terms of Service
        </h1>

        <div className="prose prose-invert max-w-none space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">Agreement</h2>
            <p className="text-fg-soft">
              By accessing and using this website, you accept and agree to be
              bound by the terms and provision of this agreement. If you do not
              agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">Use License</h2>
            <p className="text-fg-soft">
              Permission is granted to temporarily download one copy of the
              materials (information or software) on Precise Fumes website for
              personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul className="list-disc list-inside text-fg-soft space-y-2 mt-4">
              <li>Modifying or copying the materials</li>
              <li>
                Using the materials for any commercial purpose or for any
                public display
              </li>
              <li>
                Attempting to decompile or reverse engineer any software on
                Precise Fumes website
              </li>
              <li>Removing any copyright or other proprietary notations</li>
              <li>
                Transferring the materials to another person or 'mirroring' the
                materials on any other server
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">Disclaimer</h2>
            <p className="text-fg-soft">
              The materials on Precise Fumes website are provided 'as is'.
              Precise Fumes makes no warranties, expressed or implied, and
              hereby disclaims and negates all other warranties including,
              without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">Limitations</h2>
            <p className="text-fg-soft">
              In no event shall Precise Fumes or its suppliers be liable for
              any damages (including, without limitation, damages for loss of
              data or profit, or due to business interruption) arising out of
              the use or inability to use the materials on Precise Fumes
              website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Accuracy of Materials
            </h2>
            <p className="text-fg-soft">
              The materials appearing on Precise Fumes website could include
              technical, typographical, or photographic errors. Precise Fumes
              does not warrant that any of the materials on our website are
              accurate, complete, or current. Precise Fumes may make changes to
              the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Links Disclaimer
            </h2>
            <p className="text-fg-soft">
              Precise Fumes has not reviewed all of the sites linked to our
              website and is not responsible for the contents of any such linked
              site. The inclusion of any link does not imply endorsement by
              Precise Fumes of the site. Use of any such linked website is at
              the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Modifications
            </h2>
            <p className="text-fg-soft">
              Precise Fumes may revise these terms of service for its website at
              any time without notice. By using this website, you are agreeing
              to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">
              Governing Law
            </h2>
            <p className="text-fg-soft">
              These terms and conditions are governed by and construed in
              accordance with the laws of Pakistan and you irrevocably submit to
              the exclusive jurisdiction of the courts located in Karachi.
            </p>
          </section>

          <p className="text-xs text-fg-faint pt-8">
            Last updated: July 2026
          </p>
        </div>
      </div>
    </div>
  );
}
