import { el } from "../util.js";

// Mirror of stages/1_1_instructions — information sheet / consent.
// A single "I agree" checkbox gates the proceed button.

const SHEET_HTML = `
<p>This study has been approved by the UCL Departmental Ethics Chair for Experimental Psychology. Project ID number: 0497.</p>
<p>We would like to invite you to participate in this research project being run by Greta Sanna (greta.sanna.23@ucl.ac.uk) under the supervision of Prof. David Lagnado (d.lagnado@ucl.ac.uk).</p>
<p>Participation in this study is voluntary. There are no consequences if you decide not to participate, or if you decide to withdraw part way through. In addition, if you decide after participating that you would not like your personal data to be used further, you can contact the researchers within 7 days after participating and the data will be deleted. After 7 days, it may be difficult or impossible to delete your personal data because it may have been shared in an anonymous or pseudoanonymous form with other researchers.</p>
<p>Personal data (such as your age and gender) will be collected on the basis of your consent. It will be anonymised or pseudoanonymised so that you cannot be identified as an individual on the basis of the information provided.</p>
<p>The data will be stored on encrypted and password protected devices and on the UCL IT network. This study will take approximately <b>10 minutes</b> to complete and you will be paid <b>£1.50</b> for your time. Before you decide whether you want to take part, it is important for you to read the following information carefully. This study examines how well individuals can discern between true and false information. You will be redirected to an online platform where you will be given a list of headlines.</p>
<ul>
  <li>For each headline, you'll be <b>asked to rate the extent to which you believe it is true.</b></li>
  <li><b>Other participants will </b><u><b>simultaneously</b></u><b> be evaluating the same headline</b> and sharing their thoughts.</li>
  <li>After each evaluation you will be asked to <b>share your own thoughts</b> in the format of a media post. <b>This information will be shared with other participants.</b></li>
</ul>
<p><b><span style="color:#ff5a5a">Only take part in this survey if you describe yourself as a Republican or Democrat.</span></b></p>
<p><b>Data Protection</b></p>
<p>If you are concerned about any aspect of this study, please contact the principal researcher. If your concerns are not satisfactorily resolved, you can contact the Chair of the UCL Research Ethics Committee at: ethics@ucl.ac.uk</p>
<p>The information that we collect in this study will be kept strictly confidential. You will not be able to be identified in any publications unless you explicitly agree to be identified. The results of the study may be published in an academic paper and may be used in subsequent research.</p>
<p>The data controller for this project is UCL. Any personal data will be processed for the reasons set out in this information sheet if you agree with the accompanying consent form. Any personal data will be processed for so long as it is required for the research project. We will anonymise or pseudonymise your personal data and minimise the processing of personal data where we can.</p>
<p>The UCL Data Protection Office provides oversight of UCL activities involving the processing of personal data. If you are concerned about how your personal data is being processed, please contact: data-protection@ucl.ac.uk If UCL is unable to address your concerns, please contact the Information Commissioner's Office: <a href="https://ico.org.uk/" target="_blank" rel="noopener">https://ico.org.uk/</a></p>
<p><b>Consent</b></p>
<p>Please confirm that you agree with all of the following:</p>
<ul>
  <li>I have read the information above and understand I can email the researchers with any questions.</li>
  <li>I understand that my personal information will be used for the purposes explained to me. I understand that according to data protection legislation, 'public task' will be the lawful basis for processing.</li>
  <li>I understand that all my personal information will remain confidential and that my data gathered in the study will be stored anonymously and securely. It will not be possible to identify me in any publications.</li>
  <li>I understand that my anonymised research data may be shared with, and used by, others for future research (no-one will be able to identify you when these data are shared).</li>
  <li>I understand that I am free to withdraw from the study without penalty if I so wish, simply by closing my browser.</li>
  <li>I confirm that I am over 18 years of age.</li>
  <li>I consent to take part in the study.</li>
</ul>
`;

export function runInstructions1(mount) {
  return new Promise((resolve) => {
    const checkbox = el("input", { type: "checkbox", id: "consent-agree" });
    const agreeLabel = el("label.checkbox-row", { htmlFor: "consent-agree" }, [
      checkbox,
      el("span", { text: "I agree to all of the above." }),
    ]);
    const proceed = el("button.proceed-button", { type: "button", text: "Agree & proceed", disabled: true });

    checkbox.addEventListener("change", () => {
      proceed.disabled = !checkbox.checked;
    });
    proceed.addEventListener("click", () => resolve());

    mount.append(
      el("div.stage.scroll-stage", {}, [
        el("div.stage-content", {}, [
          el("h1", { text: "Information Sheet" }),
          el("div.rich-text", { html: SHEET_HTML }),
          agreeLabel,
          proceed,
        ]),
      ])
    );
  });
}
