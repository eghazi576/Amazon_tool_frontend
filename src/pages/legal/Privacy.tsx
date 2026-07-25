import LegalLayout from "./LegalLayout";
import { ADDRESS, CONTACT_EMAIL, COMPANY, PHONE } from "@/lib/legal";

/**
 * The formal Privacy Policy supplied by the business (Mentify LLC), rendered in
 * the shared legal styling. Company details come from src/lib/legal.ts so the
 * address, email and phone stay consistent with the Terms and Cookie pages.
 *
 * NOTE for future edits: this document, as supplied, describes some data
 * handling that the current app does not actually do (it mentions analytics
 * cookies, and collecting full name / country, none of which the code does). The
 * Cookie Policy page states the opposite -- no analytics cookies. If the app's
 * behaviour is the source of truth, these should be reconciled; they are left as
 * the business provided them.
 */
const Privacy = () => (
  <LegalLayout
    path="/privacy"
    title="Privacy Policy"
    effectiveDate="16 July 2026"
    intro="How Mentify LLC collects, uses, stores, discloses, and otherwise processes personal information when you use WholesaleOS."
  >
    <section>
      <h2>1. Introduction</h2>
      <p>
        Welcome to WholesaleOS, a software-as-a-service ("SaaS") platform owned and operated by{" "}
        {COMPANY} ("Mentify LLC," "WholesaleOS," "we," "our," or "us"). WholesaleOS is an Amazon
        product and brand research platform designed to help businesses, entrepreneurs, online sellers,
        wholesalers, and eCommerce professionals make informed sourcing decisions by providing
        analytical insights, product evaluations, brand research, and proprietary scoring methodologies.
      </p>
      <p>
        At {COMPANY}, we recognize that privacy is fundamental to maintaining the trust of our users. We
        are committed to protecting the confidentiality, integrity, and security of the personal
        information entrusted to us. This Privacy Policy explains how we collect, use, store, disclose,
        transfer, and otherwise process personal information when you access or use our website located
        at <a href="https://www.thewholesaleos.com">https://www.thewholesaleos.com</a>, create an
        account, communicate with us, or otherwise interact with our Services.
      </p>
      <p>
        This Privacy Policy applies to all visitors, registered users, customers, and other individuals
        who access or use WholesaleOS from anywhere in the world. By accessing or using our Services, you
        acknowledge that you have read, understood, and agreed to the collection and use of your
        information as described in this Privacy Policy.
      </p>
      <p>
        If you do not agree with the practices described in this Privacy Policy, you should discontinue
        your use of the Services.
      </p>
    </section>

    <section>
      <h2>2. Company Information</h2>
      <p>WholesaleOS is owned and operated by:</p>
      <ul>
        <li>
          <strong>{COMPANY}</strong>
          <br />
          {ADDRESS.street}
          <br />
          {ADDRESS.city}, {ADDRESS.region} {ADDRESS.postalCode}
          <br />
          United States of America
        </li>
        <li><strong>Email:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
        <li><strong>Phone:</strong> {PHONE}</li>
        <li><strong>Website:</strong> <a href="https://www.thewholesaleos.com">https://www.thewholesaleos.com</a></li>
      </ul>
      <p>
        Throughout this Privacy Policy, references to "Mentify LLC," "WholesaleOS," "we," "our," or "us"
        refer to the company identified above.
      </p>
    </section>

    <section>
      <h2>3. Scope of this Privacy Policy</h2>
      <p>
        This Privacy Policy governs the processing of personal information collected through or in
        connection with:
      </p>
      <ul>
        <li>The WholesaleOS website.</li>
        <li>User registration and account management.</li>
        <li>Product and brand research features.</li>
        <li>Amazon ASIN analysis tools.</li>
        <li>Search history and saved research.</li>
        <li>Customer support communications.</li>
        <li>Marketing communications where applicable.</li>
        <li>Any future applications, software, or services operated under the WholesaleOS brand.</li>
      </ul>
      <p>
        This Privacy Policy applies regardless of the country from which you access our Services. Because
        WholesaleOS is available internationally, local privacy laws may grant additional rights to users
        residing in certain jurisdictions. Nothing in this Privacy Policy is intended to limit any rights
        you may have under applicable law.
      </p>
    </section>

    <section>
      <h2>4. Definitions</h2>
      <p>For the purposes of this Privacy Policy, the following terms shall have the meanings set forth below:</p>
      <ul>
        <li><strong>"Account"</strong> means the registered profile created by a user for accessing WholesaleOS.</li>
        <li><strong>"Personal Information"</strong> means any information that identifies, relates to, describes, or could reasonably be linked to an identifiable individual.</li>
        <li><strong>"Processing"</strong> means any operation performed on personal information, including collection, recording, organization, storage, use, disclosure, transmission, modification, deletion, or destruction.</li>
        <li><strong>"Services"</strong> means the WholesaleOS website, software platform, research tools, features, content, and all related services made available by {COMPANY}.</li>
        <li><strong>"User," "you," or "your"</strong> means any individual or organization accessing or using the Services.</li>
        <li><strong>"Website"</strong> means https://www.thewholesaleos.com and any related webpages operated by {COMPANY}.</li>
      </ul>
      <p>Words used in the singular include the plural where appropriate, and vice versa.</p>
    </section>

    <section>
      <h2>5. Information We Collect</h2>
      <p>
        To operate WholesaleOS efficiently and provide high-quality research services, we collect
        different categories of information depending on how you interact with our platform.
      </p>

      <h3>5.1 Information You Provide Directly</h3>
      <p>
        When you create an account, communicate with us, or otherwise use our Services, you may
        voluntarily provide information including:
      </p>
      <ul>
        <li>Email address</li>
        <li>Password (stored only as a secure one-way hash, never in plain text)</li>
        <li>Account preferences</li>
        <li>Support requests and correspondence</li>
        <li>Feedback and suggestions you choose to submit</li>
      </ul>
      <p>
        This information is collected to establish your account, authenticate your identity, provide
        customer support, and deliver the Services you request.
      </p>

      <h3>5.2 Account Information</h3>
      <p>When you register for WholesaleOS, we automatically maintain information associated with your account, including:</p>
      <ul>
        <li>Account creation date</li>
        <li>Account status</li>
        <li>Login history</li>
        <li>Password change history</li>
        <li>Security preferences</li>
        <li>Profile settings</li>
        <li>User preferences</li>
      </ul>
      <p>Your password is never stored in plain text. We use industry-standard security practices to protect authentication credentials.</p>

      <h3>5.3 Research Activity</h3>
      <p>As part of providing our Services, WholesaleOS records certain information relating to your use of the platform. This may include:</p>
      <ul>
        <li>Amazon Standard Identification Numbers (ASINs) searched through the platform.</li>
        <li>Product research history.</li>
        <li>Brand research history.</li>
        <li>Search timestamps.</li>
        <li>Saved research projects.</li>
        <li>User-generated notes associated with research activities.</li>
        <li>Product scoring history.</li>
        <li>Brand scoring history.</li>
        <li>Feature usage statistics.</li>
      </ul>
      <p>
        We use this information to provide core functionality, maintain user history, improve the
        accuracy of our analytical models, and enhance the overall user experience.
      </p>
      <p>
        Research data is associated with your account so that you can access your previous searches and
        continue your workflow across future sessions.
      </p>

      <h3>5.4 Technical Information</h3>
      <p>
        When you access WholesaleOS, certain technical information is collected automatically to ensure
        the proper operation, performance, and security of our Services. Such information may include:
      </p>
      <ul>
        <li>Internet Protocol (IP) address.</li>
        <li>Browser type and version.</li>
        <li>Operating system.</li>
        <li>Device type.</li>
        <li>Device identifiers.</li>
        <li>Language settings.</li>
        <li>Time zone.</li>
        <li>Date and time of access.</li>
        <li>Pages visited.</li>
        <li>Session duration.</li>
        <li>Error logs and diagnostic information.</li>
      </ul>
      <p>
        This technical information helps us maintain system stability, improve performance, detect
        security incidents, and troubleshoot operational issues.
      </p>
    </section>

    <section>
      <h2>6. Purposes for Processing Personal Information</h2>
      <p>
        {COMPANY} collects and processes personal information solely for legitimate business purposes and
        in accordance with applicable privacy laws. The information we collect enables us to provide a
        secure, reliable, and continuously improving experience for users of WholesaleOS.
      </p>
      <p>
        We use personal information primarily to establish and manage user accounts, authenticate account
        holders, provide access to platform features, and maintain the overall functionality of our
        Services. When a user performs product or brand research, the information generated through those
        activities allows us to deliver personalized research history, maintain saved searches, improve
        the consistency of analytical results, and enhance the overall efficiency of the platform.
      </p>
      <p>
        Personal information may also be processed to communicate with users regarding their accounts,
        respond to customer support inquiries, investigate reported issues, and provide important notices
        relating to security, maintenance, or changes affecting the Services. In certain situations, we
        may process information to prevent fraudulent activity, detect unauthorized access attempts,
        investigate abuse of the platform, or protect the rights, property, and safety of {COMPANY}, our
        users, and the public.
      </p>
      <p>
        We continually evaluate and improve WholesaleOS. Information collected through the platform may
        therefore be used to understand usage patterns, measure platform performance, identify areas for
        improvement, develop new features, optimize user experience, and maintain the security and
        stability of our systems.
      </p>
      <p>
        We do not use personal information for purposes that are incompatible with those described in this
        Privacy Policy without first providing appropriate notice where required by applicable law.
      </p>
    </section>

    <section>
      <h2>7. Legal Basis for Processing</h2>
      <p>
        Where applicable under international privacy laws, including the General Data Protection Regulation
        ("GDPR"), {COMPANY} processes personal information on one or more of the following legal bases.
      </p>
      <h3>Performance of a Contract</h3>
      <p>
        Processing is necessary to create and maintain user accounts, provide access to WholesaleOS,
        deliver requested services, maintain saved research, authenticate users, and fulfill our
        contractual obligations.
      </p>
      <h3>Legitimate Business Interests</h3>
      <p>
        We process information where necessary to operate, secure, maintain, improve, and develop
        WholesaleOS, provided that such interests are not overridden by applicable legal rights of users.
      </p>
      <h3>Compliance with Legal Obligations</h3>
      <p>
        Certain information may be processed where required by applicable laws, regulations, governmental
        requests, court orders, or other legal obligations.
      </p>
      <h3>Consent</h3>
      <p>
        Where processing activities require user consent under applicable law, such consent may be
        withdrawn at any time. Withdrawal of consent will not affect the lawfulness of processing
        conducted prior to the withdrawal.
      </p>
    </section>

    <section>
      <h2>8. Cookies and Similar Technologies</h2>
      <p>
        WholesaleOS uses cookies and similar technologies to improve functionality, enhance user
        experience, maintain account security, and support the efficient operation of the platform.
      </p>
      <p>
        Cookies are small text files placed on a user's device when visiting a website. These files help
        websites recognize returning users, remember preferences, maintain authenticated sessions, and
        improve website performance.
      </p>
      <p>The cookies used by WholesaleOS generally fall into several categories.</p>
      <h3>Essential Cookies</h3>
      <p>
        Essential cookies are required for the operation of the Services. Without these cookies, certain
        functions of WholesaleOS, including account authentication and secure access to protected areas,
        may not operate correctly.
      </p>
      <h3>Functional Cookies</h3>
      <p>
        Functional cookies remember user preferences, language settings, and other customization choices
        to improve the browsing experience and reduce the need for repeated configuration during future
        visits.
      </p>
      <h3>Analytics and Advertising Cookies</h3>
      <p>
        WholesaleOS does not use analytics, advertising, or tracking cookies. We do not run Google
        Analytics, a tag manager, an advertising pixel, or a session recorder. The public pages of the
        site set no cookies at all; the only cookies we set are the strictly necessary ones described
        above, used to keep you signed in. If this ever changes, this Privacy Policy and our Cookie Policy
        will be updated before any such cookie is introduced.
      </p>
      <p>
        Users may control or disable cookies through their browser settings. However, disabling the
        strictly necessary cookies will prevent you from staying signed in.
      </p>
      <p>
        Additional information regarding cookies is available in our separate <a href="/cookies">Cookie Policy</a>.
      </p>
    </section>

    <section>
      <h2>9. Data Retention</h2>
      <p>
        {COMPANY} retains personal information only for as long as necessary to fulfill the purposes
        described in this Privacy Policy, comply with applicable legal obligations, resolve disputes,
        enforce contractual agreements, and maintain the integrity of our Services.
      </p>
      <p>
        The length of time personal information is retained depends upon the nature of the information,
        the purposes for which it was collected, applicable legal requirements, and legitimate business
        needs.
      </p>
      <p>
        Information associated with active user accounts may be retained for the duration of the user's
        relationship with WholesaleOS. Following account deletion, certain information may remain
        temporarily where required to resolve disputes, investigate security incidents, comply with legal
        obligations, or protect the legitimate interests of {COMPANY}.
      </p>
      <p>
        Once information is no longer required, reasonable measures will be taken to securely delete,
        anonymize, or otherwise render the information incapable of identifying an individual.
      </p>
    </section>

    <section>
      <h2>10. Disclosure of Personal Information</h2>
      <p>{COMPANY} values user privacy and does not sell personal information.</p>
      <p>
        We may disclose personal information only under limited circumstances where such disclosure is
        necessary to operate the Services, comply with legal obligations, protect legitimate business
        interests, or safeguard the rights and safety of our users.
      </p>
      <p>
        Personal information may be disclosed where required by law, regulation, judicial process,
        subpoena, governmental request, or other legally enforceable obligation.
      </p>
      <p>
        Information may also be disclosed where we reasonably believe such action is necessary to
        investigate suspected fraud, prevent unauthorized access, protect the security of WholesaleOS,
        enforce our legal rights, respond to violations of our Terms of Service, or protect the safety of
        users or the general public.
      </p>
      <p>
        In the event that {COMPANY} undergoes a merger, acquisition, corporate restructuring, financing
        transaction, or sale of all or a portion of its assets, personal information may be transferred as
        part of that transaction, subject to appropriate confidentiality obligations and applicable legal
        requirements.
      </p>
      <p>
        Except as expressly described in this Privacy Policy or required by applicable law, we do not
        disclose personal information for unrelated commercial purposes.
      </p>
    </section>

    <section>
      <h2>11. International Data Transfers</h2>
      <p>
        WholesaleOS is accessible to users around the world. As a result, personal information may be
        transferred to, stored, or processed in countries other than the country in which a user resides.
      </p>
      <p>
        By using WholesaleOS, users acknowledge that information may be processed in jurisdictions whose
        privacy laws may differ from those of their home country.
      </p>
      <p>
        Regardless of where processing occurs, {COMPANY} implements reasonable safeguards designed to
        protect personal information and ensure an appropriate level of security consistent with
        applicable privacy principles.
      </p>
      <p>
        Where required by applicable law, appropriate contractual or organizational safeguards will be
        implemented before transferring personal information across international borders.
      </p>
    </section>

    <section>
      <h2>12. Data Security</h2>
      <p>
        The security of your personal information is a priority for {COMPANY}. We maintain reasonable
        administrative, technical, and organizational safeguards designed to protect personal information
        against accidental loss, unauthorized access, misuse, alteration, disclosure, or destruction.
      </p>
      <p>
        Our security practices are continuously reviewed and updated to address evolving cybersecurity
        risks and industry standards. We implement security measures intended to preserve the
        confidentiality, integrity, and availability of the information entrusted to us.
      </p>
      <p>
        Although we make every reasonable effort to protect your information, no method of transmitting
        information over the Internet or storing electronic information can be guaranteed to be completely
        secure. Consequently, while we strive to use commercially acceptable means to protect your
        personal information, we cannot guarantee its absolute security.
      </p>
      <p>
        Users are responsible for maintaining the confidentiality of their account credentials and should
        notify us immediately if they believe their account has been compromised or accessed without
        authorization.
      </p>
    </section>

    <section>
      <h2>13. User Responsibilities</h2>
      <p>
        Users play an important role in maintaining the security of their accounts and personal
        information. By using WholesaleOS, you agree to take reasonable precautions to protect your
        account credentials and prevent unauthorized access.
      </p>
      <p>
        You are responsible for maintaining the confidentiality of your login information, selecting a
        strong password, and ensuring that your account is not shared with others. You should promptly
        update your account information whenever it changes to ensure that the information associated with
        your account remains accurate and complete.
      </p>
      <p>
        You agree to notify {COMPANY} immediately if you become aware of any unauthorized access,
        suspected security incident, or other activity that may compromise the security of your account
        or the Services.
      </p>
    </section>

    <section>
      <h2>14. Your Privacy Rights</h2>
      <p>
        Depending on your country of residence and applicable privacy laws, you may have certain rights
        regarding your personal information. Subject to applicable legal requirements and verification of
        your identity, these rights may include:
      </p>
      <h3>Right to Access</h3>
      <p>You may request confirmation as to whether we process your personal information and obtain access to the information we maintain about you.</p>
      <h3>Right to Correction</h3>
      <p>You may request that inaccurate, outdated, or incomplete personal information be corrected or updated.</p>
      <h3>Right to Deletion</h3>
      <p>You may request deletion of your personal information where such deletion is permitted by applicable law and does not conflict with our legal obligations or legitimate business interests.</p>
      <h3>Right to Restrict Processing</h3>
      <p>In certain circumstances, you may request that we temporarily restrict the processing of your personal information.</p>
      <h3>Right to Object</h3>
      <p>Where applicable, you may object to our processing of your personal information based on legitimate interests or other legal grounds recognized under applicable law.</p>
      <h3>Right to Data Portability</h3>
      <p>Where technically feasible and legally applicable, you may request a copy of certain personal information in a structured, commonly used, and machine-readable format.</p>
      <h3>Right to Withdraw Consent</h3>
      <p>Where processing is based on consent, you may withdraw your consent at any time. Withdrawal of consent will not affect the lawfulness of processing conducted before the withdrawal.</p>
      <p>
        To exercise any of these rights, you may contact us using the information provided in the "Contact
        Us" section below. We may request additional information to verify your identity before processing
        your request.
      </p>
    </section>

    <section>
      <h2>15. Account Deletion</h2>
      <p>Users may request deletion of their WholesaleOS account at any time by contacting {COMPANY}, or directly from the account settings within the Services.</p>
      <p>
        Upon verification of the request, we will take reasonable steps to delete or anonymize personal
        information associated with the account, except where retention is required by applicable law,
        necessary to resolve disputes, enforce our agreements, investigate security incidents, or protect
        our legitimate business interests.
      </p>
      <p>
        Account deletion may result in the permanent removal of account preferences, research history,
        saved projects, and other information associated with the account. Once deleted, certain
        information may not be recoverable.
      </p>
    </section>

    <section>
      <h2>16. Children's Privacy</h2>
      <p>
        WholesaleOS is a business tool intended for individuals who are at least sixteen (16) years of
        age, consistent with our Terms of Service. We do not knowingly collect personal information from
        children under the age of 16.
      </p>
      <p>
        If we become aware that personal information has been collected from a child under the age of 16
        without appropriate authorization, we will take reasonable steps to delete such information as
        soon as practicable.
      </p>
      <p>
        Parents or legal guardians who believe that a child has provided personal information through
        WholesaleOS are encouraged to contact us immediately.
      </p>
    </section>

    <section>
      <h2>17. Third-Party Links</h2>
      <p>The WholesaleOS website may contain links to external websites or resources provided for informational or convenience purposes.</p>
      <p>
        {COMPANY} does not control and is not responsible for the privacy practices, security measures,
        content, or policies of third-party websites. Accessing such websites is at your own discretion
        and risk. We encourage users to review the privacy policies of any external websites they visit
        before providing personal information.
      </p>
    </section>

    <section>
      <h2>18. Changes to this Privacy Policy</h2>
      <p>
        {COMPANY} reserves the right to update or modify this Privacy Policy at any time to reflect
        changes in our business operations, legal obligations, technological developments, or industry
        best practices.
      </p>
      <p>
        When material changes are made, the updated Privacy Policy will be published on this page with a
        revised effective date. Continued use of WholesaleOS after such changes become effective
        constitutes your acceptance of the revised Privacy Policy.
      </p>
      <p>If required by applicable law, we may provide additional notice regarding significant changes through appropriate communication channels.</p>
    </section>

    <section>
      <h2>19. Governing Law</h2>
      <p>
        This Privacy Policy shall be governed by and interpreted in accordance with the laws of the State
        of New Mexico, United States, without regard to its conflict of law principles.
      </p>
      <p>Nothing in this Privacy Policy shall limit any mandatory rights that users may have under the applicable laws of their country of residence.</p>
    </section>

    <section>
      <h2>20. Contact Us</h2>
      <p>
        If you have any questions, concerns, requests, or complaints regarding this Privacy Policy or our
        handling of your personal information, please contact us using the information below:
      </p>
      <ul>
        <li>
          <strong>{COMPANY}</strong>
          <br />
          {ADDRESS.street}
          <br />
          {ADDRESS.city}, {ADDRESS.region} {ADDRESS.postalCode}
          <br />
          United States
        </li>
        <li><strong>Email:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
        <li><strong>Phone:</strong> {PHONE}</li>
        <li><strong>Website:</strong> <a href="https://www.thewholesaleos.com">https://www.thewholesaleos.com</a></li>
      </ul>
      <p>We will make reasonable efforts to respond to legitimate privacy-related inquiries within a reasonable timeframe and in accordance with applicable law.</p>
    </section>

    <section>
      <h2>21. Entire Agreement</h2>
      <p>
        This Privacy Policy constitutes the complete privacy policy governing your use of WholesaleOS and
        supersedes any prior privacy statements or understandings relating to the subject matter herein.
      </p>
      <p>If any provision of this Privacy Policy is determined to be unlawful, invalid, or unenforceable, the remaining provisions shall remain in full force and effect.</p>
      <p>Failure by {COMPANY} to enforce any provision of this Privacy Policy shall not constitute a waiver of any right or provision.</p>
      <p className="!mt-6 text-xs text-muted-foreground">© 2026 {COMPANY}. All Rights Reserved.</p>
    </section>
  </LegalLayout>
);

export default Privacy;
