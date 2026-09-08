import { BrandLogo } from "@/components/brand-logo";
import { PrintButton } from "./print-button";

const officialResources = [
  {
    label: "FSAI: Starting a food business in the home",
    href: "https://www.fsai.ie/business-advice/starting-a-food-business/starting-a-food-business-in-the-home",
  },
  {
    label: "FSAI: Registering a food business",
    href: "https://www.fsai.ie/business-advice/starting-a-food-business/register",
  },
  {
    label: "HSE: Notify the HSE about starting a food business",
    href: "https://about.hse.ie/environmental-health/notify-the-hse-about-starting-a-food-business/",
  },
  {
    label: "FSAI: Safe Catering Pack record books",
    href: "https://www.fsai.ie/publications/safe-catering-pack-record-books",
  },
  {
    label: "FSAI: Allergen information for non-prepacked food",
    href: "https://www.fsai.ie/business-advice/running-a-food-business/allergens/allergen-information-for-non-prepacked-food",
  },
  {
    label: "FSAI Guidance Note 28: Food allergen declarations",
    href: "https://www.fsai.ie/getmedia/1b1dc6b3-9527-40df-80d9-087d86ba8f5a/gn-28-food-allergen-declaration-for-non-prepacked-foods-in-ireland-rev-2.pdf?ext=.pdf",
  },
];

const openingChecklist = [
  "Dedicated Cakish refrigerator is clean, operating at 0–5°C, and contains no household food.",
  "Dedicated Cakish pantry is clean, dry, closed, and contains only business ingredients, packaging, and equipment.",
  "Worktops, sink, taps, handles, switches, scales, mixer, and utensils are visibly clean.",
  "Handwashing supplies are available: warm water, liquid soap, and disposable paper towels.",
  "No pets, children, household cooking, laundry, or unrelated activity is present during production.",
  "Food-contact sanitiser is in date, labelled, and diluted according to the manufacturer’s instructions.",
  "Probe thermometer is clean, available, and checked for accuracy.",
  "Ingredients are in date, sealed, labelled, and traceable to a supplier and batch/lot.",
  "Allergen information and current supplier labels are available before accepting an order.",
  "Waste bins are clean, lined, lidded where appropriate, and not overflowing.",
  "Windows, doors, and storage areas show no evidence of pests.",
  "Clean apron/clothing is worn; hair is restrained; jewellery is removed or controlled.",
];

const closingChecklist = [
  "Finished products are covered, labelled, and placed in the dedicated Cakish refrigerator.",
  "Unused ingredients are sealed, labelled, and returned to dedicated storage.",
  "Food waste and refuse are removed from the production area.",
  "All equipment and food-contact surfaces are washed, rinsed, sanitised, and air-dried.",
  "Cloths and reusable cleaning items are removed for hygienic laundering or disposal.",
  "Temperature, cleaning, traceability, production, and corrective-action records are complete.",
  "The kitchen is returned to household use only after Cakish food and equipment are protected.",
];

const allergens = [
  "Cereals containing gluten",
  "Crustaceans",
  "Eggs",
  "Fish",
  "Peanuts",
  "Soybeans",
  "Milk",
  "Nuts",
  "Celery",
  "Mustard",
  "Sesame",
  "Sulphur dioxide / sulphites",
  "Lupin",
  "Molluscs",
];

function BlankLine({ width = "w-52" }: { width?: string }) {
  return <span aria-hidden="true" className={`inline-block border-b border-current ${width}`} />;
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-6">
          <span aria-hidden="true" className="mt-1 inline-block h-4 w-4 shrink-0 border border-[color:var(--deep-charcoal)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RecordTable({
  headers,
  rows = 7,
}: {
  headers: string[];
  rows?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="inspection-table min-w-full">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>&nbsp;</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function InspectionReadyPage() {
  return (
    <main className="inspection-pack min-h-screen bg-[color:var(--ivory)] px-4 py-8 text-[color:var(--deep-charcoal)] sm:px-6 md:px-10 print:bg-white print:p-0">
      <div className="mx-auto max-w-5xl">
        <aside className="mb-6 border border-amber-300 bg-amber-50 p-4 text-sm leading-6 print:hidden">
          <strong>Complete before the inspection:</strong> replace every blank with accurate information,
          attach the HSE registration evidence and course certificate/status, and use only records that
          reflect what actually happened. This working pack supports—but does not replace—your HACCP
          training, official FSAI materials, or instructions from the Environmental Health Officer.
        </aside>

        <header className="mb-10 flex flex-col gap-6 border-b border-[color:var(--line)] pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo priority className="h-16 w-16 object-contain" />
            <div>
              <p className="font-serif text-3xl">Cakish</p>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--soft-gold)]">
                Food Safety Management System
              </p>
            </div>
          </div>
          <PrintButton />
        </header>

        <section className="inspection-section">
          <p className="inspection-kicker">Inspection file</p>
          <h1>Home Bakery Food Safety Pack</h1>
          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <p>Business name: <strong>Cakish</strong></p>
            <p>Food business operator: <BlankLine /></p>
            <p>Premises address: <BlankLine width="w-64" /></p>
            <p>HSE registration/reference: <BlankLine /></p>
            <p>Environmental Health Office: <BlankLine /></p>
            <p>Pack issue date: <BlankLine /></p>
            <p>Pack review date: <BlankLine /></p>
            <p>HACCP/food safety course: <BlankLine /></p>
          </div>
          <div className="inspection-callout mt-6">
            <strong>Scope:</strong> Small, made-to-order home bakery producing chilled, ready-to-eat
            pavlovas for collection in Wicklow. Products contain meringue, filling, fresh cream, and
            fresh fruit. No delivery and no wholesale activity are covered by this draft.
          </div>
        </section>

        <section className="inspection-section page-break-before">
          <p className="inspection-kicker">1 · Immediate readiness</p>
          <h2>Documents and evidence to place in this folder</h2>
          <CheckList
            items={[
              "HSE food business registration/notification confirmation.",
              "HACCP or food safety training certificate, enrolment confirmation, and course completion date.",
              "Completed opening/closing, refrigerator temperature, cleaning, delivery, and production records.",
              "Current recipes and ingredient specifications for every product and optional filling/topping.",
              "Original labels or clear photographs of labels for every ingredient, including compound ingredients.",
              "Written allergen declaration for every product before sale.",
              "Supplier list, recent receipts/invoices, and ingredient lot/batch details.",
              "Thermometer accuracy-check record and sanitising procedure.",
              "Cleaning chemical labels, safety instructions, dilution instructions, and proof they are food-area suitable.",
              "Pest monitoring record and any contractor reports, if a contractor is used.",
              "Waste arrangements and evidence of potable mains water or private-water testing, as applicable.",
              "Customer/order record that permits one-step-forward traceability and product withdrawal.",
            ]}
          />
          <div className="inspection-alert mt-6">
            <strong>Do not backfill fictional records.</strong> Start real records now, explain honestly
            that the business is new, and show the controls, schedule, and corrective-action process that
            will be followed.
          </div>
        </section>

        <section className="inspection-section">
          <p className="inspection-kicker">2 · Premises controls</p>
          <h2>Home kitchen separation policy</h2>
          <p>
            Cakish production is separated from household activity by time and by dedicated storage.
            The dedicated Cakish refrigerator is used only for business ingredients and finished products.
            A separate pantry is reserved only for Cakish ingredients, packaging, supplies, and equipment.
          </p>
          <ul className="inspection-list">
            <li>Household cooking stops before Cakish cleaning and production begins.</li>
            <li>People not involved in production, including children and visitors, stay out of the kitchen.</li>
            <li>Pets are excluded from the kitchen and storage areas before, during, and after production cleaning.</li>
            <li>Business ingredients and equipment are never stored with household items.</li>
            <li>Raw materials remain covered and are stored off the floor.</li>
            <li>Ready-to-eat components are protected from dirty packaging, raw foods, chemicals, and waste.</li>
            <li>Chemicals are labelled and stored away from food, packaging, and food-contact equipment.</li>
            <li>The production area is cleaned and sanitised before work starts and after work finishes.</li>
          </ul>
          <p className="mt-5">
            Production days/times: <BlankLine width="w-72" />
          </p>
          <p className="mt-3">
            Household separation checked by: <BlankLine /> Date: <BlankLine width="w-28" />
          </p>
        </section>

        <section className="inspection-section page-break-before">
          <p className="inspection-kicker">3 · HACCP-based plan</p>
          <h2>Product flow and hazard controls</h2>
          <p className="mb-5 text-sm">
            Confirm the limits below against the completed HACCP course, ingredient manufacturers’
            instructions, and any direction from the EHO. The chilled-food limit used in this draft is 0–5°C.
          </p>
          <div className="overflow-x-auto">
            <table className="inspection-table min-w-[900px]">
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Main hazard</th>
                  <th>Control / limit</th>
                  <th>Monitoring</th>
                  <th>Corrective action</th>
                  <th>Record</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Approved purchasing</td>
                  <td>Unsafe, damaged, undeclared, or untraceable ingredients</td>
                  <td>Buy from reputable suppliers; retain labels, lot codes, and receipts</td>
                  <td>Check each purchase and recipe change</td>
                  <td>Reject or isolate anything unsuitable or without reliable information</td>
                  <td>Supplier and delivery log</td>
                </tr>
                <tr>
                  <td>Receiving</td>
                  <td>Growth of bacteria in chilled ingredients; damaged packaging</td>
                  <td>Chilled food at 5°C or below; packaging intact; food in date</td>
                  <td>Visual/date check and temperature check when received</td>
                  <td>Reject, return, or quarantine; document decision</td>
                  <td>Delivery log</td>
                </tr>
                <tr>
                  <td>Storage</td>
                  <td>Temperature abuse, contamination, allergen mix-up</td>
                  <td>Cakish fridge at 0–5°C; dry goods sealed, labelled, and separated</td>
                  <td>Fridge check at opening and closing; daily storage check</td>
                  <td>Move food to safe refrigeration; assess time/temperature; discard if safety is uncertain</td>
                  <td>Temperature and corrective-action log</td>
                </tr>
                <tr>
                  <td>Meringue preparation</td>
                  <td>Egg contamination, shells/foreign bodies, allergen cross-contact</td>
                  <td>Clean hands/equipment; eggs in date and intact; separate one egg at a time; follow validated recipe</td>
                  <td>Observe every batch; record egg supplier/lot</td>
                  <td>Discard contaminated mix; clean and sanitise affected area; review method</td>
                  <td>Batch sheet</td>
                </tr>
                <tr>
                  <td>Baking and drying</td>
                  <td>Inadequate process or physical contamination</td>
                  <td>Use the documented recipe, oven setting, time, and batch size consistently</td>
                  <td>Record actual oven setting and times for each batch</td>
                  <td>Continue processing only where safe and quality permits; otherwise discard and investigate</td>
                  <td>Batch sheet</td>
                </tr>
                <tr>
                  <td>Cooling and dry storage</td>
                  <td>Condensation, pests, handling contamination</td>
                  <td>Cool in a protected clean area; cover when cool; label and store dry</td>
                  <td>Visual check for every batch</td>
                  <td>Discard contaminated or damp product; clean area and correct storage</td>
                  <td>Batch sheet / cleaning log</td>
                </tr>
                <tr>
                  <td>Cream, filling, fruit preparation</td>
                  <td>Bacterial growth, soil, foreign bodies, allergen cross-contact</td>
                  <td>Keep chilled ingredients at 5°C or below; wash fruit in potable water; use clean sanitised equipment</td>
                  <td>Check fridge and ingredient temperature; observe preparation</td>
                  <td>Return ingredients to refrigeration; discard unsafe food; re-clean equipment</td>
                  <td>Temperature / batch sheet</td>
                </tr>
                <tr>
                  <td>Assembly and decoration</td>
                  <td>Contamination and extended time out of refrigeration</td>
                  <td>Work in a clean area; minimise room-temperature exposure; return finished product promptly to fridge</td>
                  <td>Record assembly start and refrigeration time</td>
                  <td>Assess total time/temperature exposure; discard if safety cannot be demonstrated</td>
                  <td>Batch sheet</td>
                </tr>
                <tr>
                  <td>Finished storage</td>
                  <td>Growth of bacteria; allergen or order mix-up</td>
                  <td>Covered and labelled at 0–5°C; correct customer/order and allergen information attached</td>
                  <td>Opening/closing checks and collection check</td>
                  <td>Correct label only where identity is certain; otherwise isolate or discard</td>
                  <td>Fridge / order log</td>
                </tr>
                <tr>
                  <td>Collection</td>
                  <td>Wrong product, loss of chill, missing allergen information</td>
                  <td>Verify customer/order; provide written allergen and storage information; minimise time unrefrigerated</td>
                  <td>Check at handover</td>
                  <td>Do not release incorrect or unsafe product</td>
                  <td>Collection record</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="inspection-section">
          <p className="inspection-kicker">4 · Allergen management</p>
          <h2>Written allergen declaration and cross-contact controls</h2>
          <div className="inspection-alert">
            Cakish pavlovas intentionally contain <strong>egg</strong> and <strong>milk</strong>.
            Nutella products intentionally contain <strong>hazelnuts, milk, and soybeans</strong>.
            Confirm every remaining allergen from the exact brands and labels used. Do not rely on memory,
            and do not make a gluten-free claim unless cross-contact is controlled and the claim is supportable.
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="inspection-table min-w-[900px]">
              <thead>
                <tr>
                  <th>Product / option</th>
                  <th>Egg</th>
                  <th>Milk</th>
                  <th>Nuts</th>
                  <th>Soy</th>
                  <th>Other declared allergen(s)</th>
                  <th>Label checked / date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Strawberry Pavlova + Dulce de Leche</td>
                  <td>Yes</td>
                  <td>Yes</td>
                  <td>Check labels</td>
                  <td>Check labels</td>
                  <td>Complete from every ingredient label</td>
                  <td />
                </tr>
                <tr>
                  <td>Strawberry Pavlova + Nutella</td>
                  <td>Yes</td>
                  <td>Yes</td>
                  <td>Hazelnut</td>
                  <td>Yes</td>
                  <td>Complete from every ingredient label</td>
                  <td />
                </tr>
                <tr>
                  <td>Heart Pavlova + chosen filling</td>
                  <td>Yes</td>
                  <td>Yes</td>
                  <td>Depends on filling/labels</td>
                  <td>Depends on filling/labels</td>
                  <td>Complete from every ingredient label</td>
                  <td />
                </tr>
                <tr>
                  <td>Mixed Berries Pavlova + chosen filling</td>
                  <td>Yes</td>
                  <td>Yes</td>
                  <td>Depends on filling/labels</td>
                  <td>Depends on filling/labels</td>
                  <td>Complete from every ingredient label</td>
                  <td />
                </tr>
                <tr>
                  <td>Raspberry Pavlova + chosen filling</td>
                  <td>Yes</td>
                  <td>Yes</td>
                  <td>Depends on filling/labels</td>
                  <td>Depends on filling/labels</td>
                  <td>Complete from every ingredient label</td>
                  <td />
                </tr>
                <tr>
                  <td>Topper / decoration / colour / sprinkles</td>
                  <td>Check labels</td>
                  <td>Check labels</td>
                  <td>Check labels</td>
                  <td>Check labels</td>
                  <td>Complete before use</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="inspection-subheading">Allergen procedure</h3>
          <CheckList
            items={[
              "Keep the original packaging or a current label photograph/specification for every ingredient.",
              "Review the allergen matrix whenever a recipe, decoration, ingredient brand, or supplier changes.",
              "Record allergen information in writing for the exact product before the customer commits to buy.",
              "Store ingredients closed and clearly identified; prevent spills and ingredient swaps.",
              "Clean and sanitise food-contact surfaces and equipment before production.",
              "Do not promise an allergen-free product where the shared home environment cannot guarantee it.",
              "If allergen information is uncertain, stop the order or omit the ingredient until it is verified.",
            ]}
          />
          <details className="mt-6 border border-[color:var(--line)] p-4 print:block">
            <summary className="cursor-pointer font-semibold">The 14 regulated allergens checklist</summary>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {allergens.map((allergen) => (
                <p key={allergen}>☐ {allergen}</p>
              ))}
            </div>
          </details>
        </section>

        <section className="inspection-section page-break-before">
          <p className="inspection-kicker">5 · Cleaning and personal hygiene</p>
          <h2>Cleaning method and schedule</h2>
          <ol className="inspection-list list-decimal">
            <li>Remove or protect food and packaging.</li>
            <li>Remove loose debris.</li>
            <li>Wash with the appropriate detergent and warm water.</li>
            <li>Rinse where the product instructions require it.</li>
            <li>Apply food-area sanitiser at the labelled dilution and contact time.</li>
            <li>Allow to air-dry or use a hygienic single-use method.</li>
            <li>Record completion and any corrective action.</li>
          </ol>
          <div className="mt-6 overflow-x-auto">
            <table className="inspection-table min-w-[800px]">
              <thead>
                <tr>
                  <th>Item / area</th>
                  <th>Frequency</th>
                  <th>Method / chemical</th>
                  <th>Responsible person</th>
                  <th>Verification</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Worktops and food-contact surfaces", "Before and after every production session"],
                  ["Mixer, bowls, whisks, spatulas, piping equipment", "After every use"],
                  ["Scales, probe thermometer, small tools", "Before/after use and between contamination risks"],
                  ["Sink, taps, handles, switches", "Before and after production; when contaminated"],
                  ["Dedicated Cakish refrigerator", "Spills immediately; full clean weekly"],
                  ["Dedicated pantry and shelving", "Check each production day; full clean monthly"],
                  ["Floors", "After production and immediately after spills"],
                  ["Bins", "After production and when soiled"],
                  ["Oven exterior and handles", "After production; deep clean as required"],
                ].map(([item, frequency]) => (
                  <tr key={item}>
                    <td>{item}</td>
                    <td>{frequency}</td>
                    <td />
                    <td />
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="inspection-subheading">Personal hygiene and fitness to work</h3>
          <p>
            Food handling stops and the EHO/medical advice is sought where appropriate if the operator has
            vomiting, diarrhoea, fever, infected skin lesions, or another condition that may contaminate food.
            Cuts are covered with a clean, waterproof, high-visibility dressing. Hands are washed before food
            work, after using the toilet, after touching waste/phones/face/hair, after cleaning, and whenever contaminated.
          </p>
          <p className="mt-4">
            Illness/return-to-work rule confirmed from HACCP training: <BlankLine width="w-72" />
          </p>
        </section>

        <section className="inspection-section">
          <p className="inspection-kicker">6 · Traceability, withdrawal, and complaints</p>
          <h2>One step back and one step forward</h2>
          <p>
            Each production batch links ingredients and their supplier/lot details to the customer order.
            Receipts, labels, batch sheets, and order records are retained together. If a safety or allergen
            issue is discovered, affected food is immediately isolated, sale stops, customers are contacted,
            and the relevant authority is notified where required.
          </p>
          <h3 className="inspection-subheading">Withdrawal / recall procedure</h3>
          <ol className="inspection-list list-decimal">
            <li>Stop using and selling the affected ingredient or product.</li>
            <li>Label and physically isolate affected stock: “DO NOT USE”.</li>
            <li>Identify affected batches, dates, and customers from records.</li>
            <li>Contact the EHO/FSAI as appropriate and follow official instructions.</li>
            <li>Contact affected customers promptly with clear safety instructions.</li>
            <li>Record quantities produced, supplied, recovered, discarded, and remaining.</li>
            <li>Investigate the cause, correct the control failure, and review the HACCP plan.</li>
          </ol>
          <p className="mt-5">EHO contact: <BlankLine width="w-64" /></p>
          <p className="mt-3">FSAI Advice Line: <strong>0818 33 66 77</strong> (verify before use)</p>
        </section>

        <section className="inspection-section page-break-before">
          <p className="inspection-kicker">7 · Daily checks</p>
          <h2>Opening checklist</h2>
          <CheckList items={openingChecklist} />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <p>Date: <BlankLine width="w-28" /></p>
            <p>Time: <BlankLine width="w-24" /></p>
            <p>Initials: <BlankLine width="w-24" /></p>
          </div>
          <h2 className="mt-10">Closing checklist</h2>
          <CheckList items={closingChecklist} />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <p>Date: <BlankLine width="w-28" /></p>
            <p>Time: <BlankLine width="w-24" /></p>
            <p>Initials: <BlankLine width="w-24" /></p>
          </div>
        </section>

        <section className="inspection-section page-break-before">
          <p className="inspection-kicker">8 · Records</p>
          <h2>Dedicated refrigerator temperature log</h2>
          <p className="mb-4 text-sm">
            Target: 0–5°C. Record the displayed temperature and periodically verify with a suitable thermometer.
          </p>
          <RecordTable
            headers={["Date", "Opening time / °C", "Closing time / °C", "Corrective action", "Initials"]}
            rows={14}
          />
        </section>

        <section className="inspection-section page-break-before">
          <p className="inspection-kicker">9 · Records</p>
          <h2>Cleaning completion log</h2>
          <RecordTable
            headers={["Date / time", "Area or equipment", "Method / chemical", "Completed by", "Issue / corrective action"]}
            rows={12}
          />
        </section>

        <section className="inspection-section page-break-before">
          <p className="inspection-kicker">10 · Records</p>
          <h2>Delivery and ingredient intake log</h2>
          <RecordTable
            headers={["Date", "Supplier / item", "Lot / use-by", "Condition / temp", "Accepted or rejected", "Initials"]}
            rows={12}
          />
        </section>

        <section className="inspection-section page-break-before">
          <p className="inspection-kicker">11 · Records</p>
          <h2>Production batch and traceability sheet</h2>
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <p>Batch code: <BlankLine /></p>
            <p>Production date: <BlankLine /></p>
            <p>Product / size / filling: <BlankLine width="w-64" /></p>
            <p>Customer/order reference: <BlankLine /></p>
            <p>Collection date/time: <BlankLine /></p>
            <p>Use-by/storage instruction: <BlankLine /></p>
          </div>
          <h3 className="inspection-subheading">Ingredient traceability</h3>
          <RecordTable
            headers={["Ingredient", "Brand / supplier", "Lot / batch", "Use-by / best-before", "Allergen label checked"]}
            rows={10}
          />
          <h3 className="inspection-subheading">Process record</h3>
          <RecordTable
            headers={["Process step", "Start time", "Finish time", "Setting / temperature", "Check / corrective action"]}
            rows={7}
          />
          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <p>Finished product fridge temperature: <BlankLine width="w-28" /> °C</p>
            <p>Written allergen information attached: Yes ☐ No ☐</p>
            <p>Released by: <BlankLine /></p>
            <p>Collection confirmed by: <BlankLine /></p>
          </div>
        </section>

        <section className="inspection-section page-break-before">
          <p className="inspection-kicker">12 · Records</p>
          <h2>Corrective action, complaint, or incident log</h2>
          <RecordTable
            headers={["Date / time", "Issue", "Affected food / batch", "Immediate action", "Follow-up / prevention", "Signed"]}
            rows={10}
          />
        </section>

        <section className="inspection-section page-break-before">
          <p className="inspection-kicker">13 · Records</p>
          <h2>Thermometer accuracy check</h2>
          <p className="mb-4 text-sm">
            Follow the thermometer manufacturer’s instructions. Record the reference method, expected reading,
            actual reading, tolerance, and action taken. Clean and sanitise the probe before and after food use.
          </p>
          <RecordTable
            headers={["Date", "Thermometer ID", "Check method", "Expected", "Actual", "Pass / action", "Initials"]}
            rows={8}
          />
        </section>

        <section className="inspection-section page-break-before">
          <p className="inspection-kicker">14 · Review</p>
          <h2>Food safety system review record</h2>
          <p>
            Review this system after an incident, complaint, failed check, recipe/supplier/equipment change,
            change in production volume, legal/guidance update, or EHO instruction—and at a planned regular interval.
          </p>
          <RecordTable
            headers={["Review date", "Reason", "Changes made", "Training/action required", "Completed by"]}
            rows={6}
          />
        </section>

        <section className="inspection-section page-break-before">
          <p className="inspection-kicker">Official references</p>
          <h2>Irish food safety guidance</h2>
          <ul className="space-y-3">
            {officialResources.map((resource) => (
              <li key={resource.href}>
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline decoration-[color:var(--soft-gold)] underline-offset-4"
                >
                  {resource.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="inspection-callout mt-8">
            <strong>Inspection notes / actions requested by the EHO</strong>
            <div className="mt-6 space-y-8">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="border-b border-[color:var(--line)] pb-6" />
              ))}
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-xs leading-5 text-[color:var(--muted-copy)] print:pb-0">
          Cakish · Handcrafted Pavlova · Wicklow, Ireland
          <br />
          Operational working document. Verify and tailor before use.
        </footer>
      </div>
    </main>
  );
}
