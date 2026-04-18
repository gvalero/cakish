# Cakish Brand Visual Design Brief

## Introduction
This document outlines the design specifications for enhancing the visual experience of the Cakish website, focusing on the Order, Story, and Gallery pages. The goal is to integrate new imagery and refine existing layouts to align with the brand's premium, modern aesthetic, improve user experience, and provide clear visual context for product selections. All new pavlova imagery must adhere to the critical art direction of showing the pavlova on a cake drum.

## 1. Order Page Layout Redesign
The current Order page lacks product imagery, hindering the customer's ability to visualize their selections. The redesign will integrate dynamic product images into the configurator.

### 1.1. Layout Structure

**Mobile-First Approach (Small Screens):**
On mobile devices, the layout will stack vertically to ensure optimal readability and interaction. The primary product image will be displayed prominently at the top, followed by the configurator options.

*   **Hero Product Image:** A single, large image of the selected pavlova (size and finish) will appear at the top of the configurator section. This image will be dynamic, updating in real-time as the user selects different sizes and finishes.
*   **Size Selection:** The existing size selection buttons (6", 8", 12") will follow the hero image.
*   **Finish Selection:** The finish selection buttons will appear below the size selection.
*   **Quantity and Order Summary:** These elements will follow the finish selection, maintaining the current flow.

**Desktop Layout (Larger Screens):**
On desktop, the layout will utilize a multi-column structure to present information efficiently.

*   **Main Content Area:** The `OrderConfigurator` component will be refactored to accommodate a new visual column.
    *   **Left Column (Image):** A dedicated column will display the dynamic hero product image. This image will update based on the user's size and finish selections.
    *   **Right Column (Configurator Options):** This column will contain the size selection, finish selection, and quantity controls. This maintains the interactive elements in a focused area.
*   **Order Summary:** The existing `aside` column for the order summary will remain on the right, providing a consistent overview of the customer's choices.

### 1.2. Image Placement and Dynamic Behavior

*   **3 Size Comparison Images (6", 8", 12"):**
    *   These images will serve as the **dynamic hero product image** within the configurator. When a user selects a size (e.g., 8"), the hero image will update to display the 8" pavlova, ideally held in hands or next to a dinner plate for scale reference. The image should be styled within a `div` using Tailwind classes similar to the existing image cards, e.g., `relative overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-white/70 p-3 shadow-[0_24px_60px_rgba(53,45,34,0.08)]`.
    *   The `src` attribute of the `Image` component will be dynamically updated based on the `selectedSize` state from `order-configurator.tsx`.
*   **2 Finish Comparison Thumbnails (Strawberry Floral Finish vs. Patisserie Sliced Finish):**
    *   These thumbnails will be integrated directly into the respective finish selection buttons. Each button (`<button>`) for a finish option will contain a small, clear thumbnail image representing that finish. The image should be visually distinct and immediately convey the finish style.
    *   The thumbnails should be small (e.g., `w-16 h-16` or `w-20 h-20`) and rounded, placed to the left of the finish name and description within the button. They should be styled to blend seamlessly with the button's active/inactive states.
    *   When a finish is selected, the main dynamic hero image (from the size selection) should also update to reflect the chosen finish, creating a comprehensive visual representation of the selected product.

### 1.3. Tailwind CSS Considerations

*   The existing `grid` and `flex` utilities, along with responsive prefixes (`md:`, `lg:`), will be used to implement the new layouts. The `OrderConfigurator` component's main `section` (`grid gap-8 lg:grid-cols-[1.05fr_0.95fr]`) will need adjustment to incorporate the image column.
*   Image styling should reuse existing classes for rounded corners, borders, and shadows (e.g., `rounded-[2rem] border border-[color:var(--line)] bg-white/70 shadow-[0_24px_60px_rgba(53,45,34,0.08)]`).

## 2. Story Page Restructure
The Story page will be enhanced with new process imagery and a clear call-to-action (CTA).

### 2.1. Process Images Placement (2-3 images)

*   **Placement:** The 2-3 new behind-the-scenes artisan images (meringue piping, layering, kitchen detail) will be strategically placed between the existing `storyPillars` sections (`Modern`, `Refined`, `Meaningful`) and the `How Collection Works` section.
*   **Layout:** These images will be presented as full-width breaks between text sections, providing visual breathing room and emphasizing the artisanal process. Each image will be enclosed in a `section` element, similar to the existing `section` elements on the page, ensuring consistent padding and spacing.
    *   **Example Structure:**
        ```html
        <section class="px-4 py-14 md:px-10 md:py-22">
          <div class="mx-auto max-w-7xl">
            <div class="relative overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-white/70 p-3 shadow-[0_24px_60px_rgba(53,45,34,0.08)] md:rounded-[2.5rem] md:p-4">
              <div class="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
                <Image src={assetPath("/images/process-image-1.jpeg")} alt="Description of process image 1" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>
        ```
*   **Alternating Text/Image:** The current `lg:grid-cols-[0.95fr_1.05fr]` pattern in the hero section can be adapted for subsequent sections if more images are added in the future, allowing for a dynamic text-image flow.

### 2.2. 
Start Your Order" CTA Button

*   **Placement:** The "Start Your Order" CTA button will be placed at the very bottom of the Story page, after the "How Collection Works" section. It should be centered and visually prominent.
*   **Design Guidance:** The CTA should utilize the existing `cakish-button` class, ensuring consistency with other primary calls to action on the site. It should be an `inline-flex` element to allow for proper centering and spacing.
    *   **Example Structure:**
        ```html
        <section class="px-4 py-14 md:px-10 md:py-22 text-center">
          <Link href="/order" className="cakish-button inline-flex">
            Start Your Order
          </Link>
        </section>
        ```

## 3. Gallery Changes
The gallery section will be updated to replace the off-brand image and maintain visual consistency.

### 3.1. Gallery Grid Layout

*   The existing gallery grid layout (`md:grid-cols-[1.1fr_0.9fr]`) is effective and should be maintained. The goal is to swap the image file, not to alter the structural presentation of the gallery.

### 3.2. Replacement Image Subject/Composition

*   The `gallery-three.jpeg` image, which is currently dark and moody, will be replaced with a new on-brand alternative. The replacement image should embody the Cakish aesthetic: light, warm, elegant, and quietly luxurious.
*   **Subject/Composition:** The new image should feature a pavlova on a cake drum, styled in a way that is consistent with the other gallery images (e.g., `gallery-one.jpeg`, `gallery-two.jpeg`, `gallery-four.jpeg`). It could be a close-up shot highlighting the delicate textures and fresh ingredients, or a beautifully composed lifestyle shot that evokes a sense of celebration and premium quality. The lighting should be soft and natural, emphasizing the product's freshness and artistry.

## 4. Global Visual Hierarchy Notes

### 4.1. Spacing, Padding, and Visual Rhythm

*   **Consistency:** Maintain the established spacing and padding conventions throughout the site. The `px-4`, `py-14`, `md:px-10`, `md:py-22` classes for sections, and `space-y-X` classes for vertical rhythm, should be consistently applied to new and modified sections.
*   **Image Card Styling:** All new image placements should adhere to the existing image card styling, which includes `rounded-[2rem]`, `border border-[color:var(--line)]`, `bg-white/70`, and `shadow-[0_24px_60px_rgba(53,45,34,0.08)]` classes. This ensures a cohesive visual experience across the site.

### 4.2. Mobile Responsiveness

*   All new image placements and layout adjustments must be fully responsive. Utilize Tailwind CSS responsive prefixes (`sm:`, `md:`, `lg:`) to ensure optimal display across various screen sizes. Prioritize mobile-first design principles, stacking content vertically on small screens and transitioning to multi-column layouts on larger screens where appropriate.

### 4.3. Image Sizing and Cropping

*   **Aspect Ratios:** New images should be cropped and sized to fit within the established aspect ratios used on the site. For example, `aspect-[4/5]` for hero images and `aspect-[4/3]` for other prominent images. Square aspect ratios (`aspect-square`) are also used for some elements.
*   **Object-Fit:** Images should use `object-cover` to ensure they fill their containers while maintaining their aspect ratio, preventing distortion.
*   **Critical Art Direction:** All pavlova images, especially the new size and finish comparison images, **MUST** show the pavlova sitting on a **CAKE DRUM** (a round base board underneath). This is a critical detail for realism and brand authenticity.

## Conclusion
This design brief provides a detailed roadmap for integrating new visual assets and refining the user experience on the Cakish website. By adhering to these specifications, the updated site will offer a more immersive and informative journey for customers, reinforcing Cakish's position as a premium modern pavlova brand. The clear art direction regarding the cake drum is paramount for all new pavlova imagery.
