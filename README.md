# DataFarm project page

Static page. Its storyline and look follow the demo video (`r2s2v-paper-staging/demo-video`): dark navy stage,
coral/red accents, Inter Tight headings. Open `index.html` through any static server, e.g. `python3 -m http.server`
(the showcase reads `static/demo/show.json`, so `file://` shows it without trajectories).

Order of the page, as in the demo:

1. **Title** and the **showcase**: simulator | farm render, three camera views each, with the gripper trajectories and the
   grasp/release events from the action labels drawn over the head view. Then the headline numbers.
2. **Video model alone vs. inside DataFarm**: Figure 8 of the paper as video. The four columns are the simulator, the
   direct call on one canvas, the direct call per camera, and DataFarm. Below it come Table 5 (motion, structure, jumps)
   and the four rendering designs of Section 4.5.
3. **The problem**, and **the idea** in four steps (calibrate, simulate, render, admit).
4. **Part one, from simulation to photograph**:
   - a drag-to-compare player for the five tasks;
   - close-ups of the scale display and the towel;
   - nine farm episodes;
   - new appearances;
   - renders rejected by review;
   - KID and optical-flow figures.
5. **Part two, the real robot**: OOD trials teleop vs. farm, the totals, and the per-task chart.
6. **Cost**: a cumulative-cost chart (means over five tasks) and the per-task table of the paper's cost model.
7. **Paper details**: the stages, Figure 1, Figure 2, Figure 8, the abstract, and the BibTeX.

## Files

- `index.html` holds all text. Numbers come from the paper:
  - abstract;
  - Section 6.1 real-robot results;
  - Section 6.2 cost, Tables 4–5;
  - Section 6.3 flow;
  - Section 6.4 KID and the views table.

  The chart data are in the `site-data` JSON block at the bottom: real-robot counts, wipe captions, view notes, and the
  cost means.
- `static/css/site.css` and `static/js/site.js` are the page styles and behaviour: showcase overlay, contrast panels
  (2×2 on phones), drag-to-compare canvas, close-up zoom, charts, tabs, scroll reveal.
  `static/js/fontawesome.all.min.js` is Font Awesome 5.15, so use FA5 icon names. Fonts come from Google Fonts.
- `static/images/` holds figure exports made by `prep_images.sh` and the PKU and NVIDIA logos.
  - Run `prep_images.sh` from the repo root on b200-9023 after the paper figures are rebuilt.
  - `prep_web_figures.sh` relabels the figures that would name the video model; the page names no renderer.
- `static/videos/` is made by `prep_media.sh` from the repo root on b200-9024:
  - `real_*`: real-robot OOD trials;
  - `gen_*`: simulator | render pairs;
  - `ood_*`: new appearances;
  - `views_*`: the four-column view comparison. Its sources are `r2s2v-release/runs/20261027-view-consistency/sources.json`,
    and the same frames as Figure 8.
- `static/demo/` is made by `prep_demo.sh` from the demo's Remotion assets:
  - the showcase pairs and `show.json` (trajectories and events);
  - close-ups;
  - the nine stack-cups episodes;
  - step clips;
  - rejected renders.

Still to fill: the Paper / arXiv / Code / Data links (marked "soon") and the arXiv id in the BibTeX. To deploy on GitHub
Pages, copy this folder to the root of a Pages repo (e.g. DAGroup-PKU/DataFarm).

Keep the page in step with the paper:

- title (`sec/macros.tex`);
- authors and affiliations (`main.tex`);
- abstract (`sec/0_abstract.tex`);
- the `site-data` numbers;
- the cost table (Table `tab:costmodel`);
- the views table (Table `tab:views`).
