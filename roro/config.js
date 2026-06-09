// Configuration file for the Purple Birthday Web App (English Edition)
// Feel free to modify the chat messages, character expressions, and credentials below!

const CONFIG = {
  // Formspree endpoint to receive the wish in your email (Optional)
  // Set up a free account at formspree.io, create a form, and paste the URL here.
  // Example: 'https://formspree.io/f/xoqzzrpb'
  FORMSPREE_ENDPOINT: 'https://formspree.io/f/mdavzrww',

  // YouTube Video ID for Glass Animals - Heat Waves
  YOUTUBE_VIDEO_ID: '-NqnPNV-llk', 

  // Netflix Credentials for the gift card reveal
  NETFLIX: {
    email: 'hurricanesquaduwu@gmail.com'
  },

  // The chat script that plays sequentially.
  // Expressions can be: 'neutral', 'smiling', 'blushing', 'excited'
  CHAT_SCRIPT: [
    {
      sender: 'Thnyan',
      text: 'Hey you… 💜\nI wasn’t sure how to start this, so I didn’t use normal words…\n\nI just opened a little portal instead ✨\nAnd somehow… it led me straight to you.',
      expression: 'smiling',
      delay: 1500
    },
    {
      sender: 'Thnyan',
      text: 'Happy Birthday 💜🎂\nYou don’t even realize how special you are…\n\nSome people just exist in your life for a moment…\nbut you? you stayed.\n\nAnd that means a lot more than you think.',
      expression: 'excited',
      delay: 2000
    },
    {
      sender: 'Thnyan',
      text: 'I know days move fast… and life gets busy 🌙\nbut there are people who make time feel softer…\n\nYou’re one of those people.\n\nAnd every memory we shared still feels warm in my mind 💫',
      expression: 'smiling',
      delay: 2000
    },
    {
      sender: 'Thnyan',
      text: 'I won’t make this long… but I just wanted you to know something 💜\n\nIf there’s one thing I’m really grateful for this year…\nit’s having you in it.\n\nAnd I hope this year gives you everything you deserve… and more ✨',
      expression: 'blushing',
      delay: 2000
    }
  ],

  // Text displayed on the final farewell page
  FAREWELL: {
    title: 'Hey… 💜',
    body: `If you’re reading this, then the little purple journey is almost over…
but there’s something I really wanted to say before it ends.

First… I want to say I’m sorry.
For any moment I might’ve annoyed you, misunderstood you, or made your day heavier instead of lighter.
I never meant to be a reason for sadness or discomfort in your life. 🌙

Sometimes people don’t realize their impact in the moment…
but looking back, I only wish I was more thoughtful, more present, and more careful with your feelings.

And thank you… 💜
For the times you were kind without needing a reason.
For the moments you stayed, even in small ways.
For existing in my life and making it softer just by being there.

I don’t know what the future holds, or where life will take us…
but I genuinely hope it treats you gently.

I hope you find happiness in things you never expected to enjoy. ✨
I hope your heart stays light, even on heavy days.
I hope you’re surrounded by people who appreciate you the way you deserve.
And I hope you always choose yourself first when you need to.

You deserve peace… not confusion.
Calm… not chaos.
And love that feels safe, not complicated. 💜

As for me…
I’ll always be quietly grateful that I got to know you, even if it was just through small moments and simple conversations.

And if life ever pulls us in different directions…
I hope you still smile when you remember this little purple hurricane I made for you 🌪️💜

No matter what happens next…
I truly wish you the happiest birthday.

And the softest, brightest year ahead of you. ✨

If there’s one last thing I want to leave you with…

I hope you’re okay.
I hope you’re happy.
And I hope you always feel valued.`,
    signOff: '💜 Happy Birthday.'
  }
};
