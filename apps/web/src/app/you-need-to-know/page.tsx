export default function InstructionPage() {
  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold mb-14">
        Event Organizer Instructions
      </h1>

      <div className="space-y-12 w-full md:max-w-[80%]">
        {/* Rules for Users */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Rules for Users
          </h2>
          <ol className="list-decimal list-inside space-y-2 ">
            <li className="font-medium">Creating an Account</li>
            <ul className="pl-10 list-disc">
              <li>
                When you create an account, you will receive a unique referral
                code.
              </li>
            </ul>
            <li className="font-medium">Using Referral Codes</li>
            <ul className="pl-10 list-disc">
              <li>
                If you use someone else's referral code when registering, you
                will receive a 10% discount on your next event purchase.
              </li>
              <li>
                The user who owns the referral code will earn 10,000 points for
                every successful registration using their code.
              </li>
            </ul>
            <li className="font-medium">Points and Discounts</li>
            <ul className="pl-10 list-disc">
              <li>
                Points earned from referrals can be redeemed for discounts on
                event purchases.
              </li>
              <li>Each point is worth 1 unit of currency.</li>
              <li>
                For example, if you have 10,000 points and an event costs
                100,000 units, you can use your points to get a 10,000-unit
                discount.
              </li>
            </ul>
          </ol>
        </section>

        {/* Rules for Organizers */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Rules for Organizers
          </h2>
          <ol className="list-decimal list-inside space-y-4">
            <li className="font-medium">Creating Events</li>
            <ul className="pl-10 list-disc space-y-2">
              <li>
                Only organizers have the ability to create and manage events.
              </li>
            </ul>
            <li className="font-medium">Purchasing Events</li>
            <ul className="pl-10 list-disc space-y-2">
              <li>
                Organizers, like customers, can purchase tickets to events.
              </li>
            </ul>
            <li className="font-medium">Using Referral Codes</li>
            <ul className="pl-10 list-disc space-y-2">
              <li>
                Organizers can also use referral codes to get a 10% discount on
                event purchases, just like other users.
              </li>
            </ul>
            <li className="font-medium">Earning and Using Points</li>
            <ul className="pl-10 list-disc space-y-2">
              <li>
                Organizers will earn 10,000 points for every successful referral
                registration.
              </li>
              <li>
                Points can be redeemed for discounts on event purchases, with
                the same rules applying as for regular users.
              </li>
            </ul>
            <li className="font-medium">Deletion Restrictions</li>
            <ul className="pl-10 list-disc space-y-2">
              <li>
                Organizers cannot be deleted until the event status is set to
                "done."
              </li>
            </ul>
            <li className="font-medium">Referral Discount Limits</li>
            <ul className="pl-10 list-disc space-y-2">
              <li>
                Organizers can set a limit on the number of users who can use
                their referral discount codes.
              </li>
            </ul>
          </ol>
        </section>

        {/* General Notes */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            General Notes
          </h2>
          <ol className="list-decimal list-inside space-y-4">
            <li className="font-medium">Discount Application</li>
            <ul className="pl-10 list-disc space-y-2">
              <li>
                Discounts from referral points are applied directly to the event
                price at checkout.
              </li>
            </ul>
            <li className="font-medium">Referral Tracking</li>
            <ul className="pl-10 list-disc space-y-2">
              <li>
                Ensure that referral codes are tracked accurately for both
                points allocation and discount application.
              </li>
            </ul>
          </ol>
        </section>
      </div>
    </>
  );
}
