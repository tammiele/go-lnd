# ChatGPT Introduction

## About ChatGPT 

### What is ChatGPT?
According to Wikipedia, ChatGPT (Chat Generative Pre-trained Transformer) is a chatbot developed by OpenAI and launched in November 2022. It is built on top of OpenAI's GPT-3 family of large language models and has been fine-tuned (an approach to transfer learning) using both supervised and reinforcement learning techniques.  
ChatGPT was launched as a prototype on November 30, 2022, and quickly garnered attention for its detailed responses and articulate answers across many domains of knowledge. Its uneven factual accuracy, however, was identified as a significant drawback. Following the release of ChatGPT, OpenAI's valuation was estimated at US$29 billion.

### Features and limitations
Although the core function of a chatbot is to mimic a human conversationalist, ChatGPT is versatile. For example, it can write and debug computer programs, compose music, teleplays, fairy tales, and student essays; answer test questions (sometimes, depending on the test, at a level above the average human test-taker); write poetry and song lyrics; emulate a Linux system; simulate an entire chat room; play games like tic-tac-toe; and simulate an ATM. ChatGPT's training data includes man pages and information about Internet phenomena and programming languages, such as bulletin board systems and the Python programming language.  
  
Unlike most chatbots, ChatGPT remembers previous prompts given to it in the same conversation; journalists have suggested that this will allow ChatGPT to be used as a personalized therapist. To prevent offensive outputs from being presented to and produced from ChatGPT, queries are filtered through OpenAI's company-wide moderation API, and potentially racist or sexist prompts are dismissed.  

ChatGPT suffers from multiple limitations. OpenAI acknowledged that ChatGPT "sometimes writes plausible-sounding but incorrect or nonsensical answers". This behavior is common to large language models and is called artificial intelligence hallucination. The reward model of ChatGPT, designed around human oversight, can be over-optimized and thus hinder performance, otherwise known as Goodhart's law. ChatGPT has limited knowledge of events that occurred after 2021. According to the BBC, as of December 2022, ChatGPT is not allowed to "express political opinions or engage in political activism". Yet, research suggests that ChatGPT exhibits a pro-environmental, left-libertarian orientation when prompted to take a stance on political statements from two established voting advice applications. In training ChatGPT, human reviewers preferred longer answers, irrespective of actual comprehension or factual content. Training data also suffers from algorithmic bias, which may be revealed when ChatGPT responds to prompts including descriptors of people. In one instance, ChatGPT generated a rap indicating that women and scientists of color were inferior to white and male scientists.  

![Limitation of ChatGPT](assets/chatgpt_racist.png "ChatGPT suffer from algorithmic bias")

### Developers and ChatGPT
For programmer folks, you can check out [this post](https://javascript.plainenglish.io/coding-wont-exist-in-5-years-this-is-why-6da748ba676c) to see how ChatGPT can assist you to write better code. The post is controversial but allows us to see the potential in speeding up tedious works, such as:
- Detect sneaky bugs
- Understand legacies code
- Refactor codebase
- Write tests
- etc

## Guide on how to create a ChatGPT yourself
The below guide will show you how to implement a ChatGPT application using Ruby on Rails and the APIs that OpenAI offers.
### Requirements
- Ruby version 3.1.2p20 
- Rails version 7.0.4.2

### Credentials
First thing first, you need an OpenAI API key to use their API. Head to their homepage, create an account then grab the API key.
![OpenAI API keys](assets/openai_api_keys.png) 

### Setup the Rails project 
Run the following code 
```
rails new chatgpt --css tailwind
```
This gonna create for us a Rails project basic template with TailwindCSS as our CSS bundle.
Navigate to the newly created application and add these following gems to your `Gemfile` and run `bundle`
```
gem "dotenv-rails"
gem "slim-rails"
gem "ruby-openai"
```
Create a .env file and add your OpenAI API key.
```
GPT_SECRECT_KEY="your_openai_api_key_go_here"
```
In `config/initializers` folder, create `openai.rb`, then add the below config
```
  Ruby::OpenAI.configure do |config|
    config.access_token = ENV['GPT_SECRECT_KEY']
  end
```
Now we are ready to create our own ChatGPT!

### Define routes 
Navigate to `config/routes.rb`, then replace the content with the follwing code:
```
Rails.application.routes.draw do
  root "chat_gpt#homepage"
  post :process_message, to: "chat_gpt#process_message"
end
```

### Create controllers
After defining routes, we need to create controllers so that our application knows what to do when a route was provoked. In `app/controllers` folder, create `chat_gpt_controller.rb` and add the following codes: 
```
class ChatGptController < ApplicationController 
  def homepage; end

  def process_message
    # @reply_content = Openai::Completion.call(params[:message_content])

    @reply_content = "pong"

    render turbo_stream: turbo_stream.update("reply_content", @reply_content)
  end
end
```

### Display the views 
Information from controllers need to be rendered on views and then send back to the user. In `app/views`, create folder `chat_gpt` and add file `homepage.html.slim` inside it. Copy the below code and paste it to `homepage.html.slim` 
```
.w-screen.min-h-screen.bg-gray-800
  .flex.flex-col.gap-4.mx-auto class="w-10/12"
    .flex.justify-center.pt-4
      .text-2xl.font-bold.mx-auto.text-gray-200 ChatGPT Clone
    
    = form_with url: process_message_path, method: :post, class: 'flex' do |f|
      = f.text_field :message_content, class: "w-11/12 bg-gray-700 text-gray-200 border-none rounded-lg p-3 focus:ring-gray-500", placeholder: "Your message goes here"
      = f.submit "Send", class: "bg-gray-200 text-gray-800 py-1 px-8 rounded-lg ml-4 font-bold"
    
    .mt-12.w-full.flex.gap-4
      .h-16.w-16.rounded-lg.bg-green-500.text-white.flex.justify-center.items-center
        | GPT
      .text-gray-200.pt-5.whitespace-normal.break-words class="w-11/12" 
        = turbo_frame_tag "reply_content"
          | Ask me anything!
```

### Check if everything is working so far 
Run `./bin/dev`, open your browser and navigate to `localhost:3000`, you should see the below image if everything was done properly
![ChatGPT views](assets/chatgpt_view.png) 
Type anything into the message bot, you should receive the reply `pong` like the image below. (If not, try to run the application with `rails s`)
![ChatGPT reply test](assets/chatgpt_reply_test.png) 

### Create OpenAI service 
In `app` folder, create new folder call `services`, then add `application_service.rb` and paste the following code
```
class ApplicationService
  def self.call(*args)
    new(*args).call
  end

  def call
    raise NotImplementedError, "You must define `call` as instance method in #{self.class.name} class"
  end
end
```
In `app/services`, create folder `openai`, then create file `completion.rb` inside it and paste the below content
```
module Openai
  class Completion < ApplicationService 
    def initialize(prompt)
      @prompt = prompt
    end

    def call 
      client = OpenAI::Client.new
      response = client.completions(
        parameters: {
          model: 'text-davinci-003',
          prompt: @prompt,
          max_tokens: 4000
        }
      )

      response.dig('choices', 0, 'text')
    end
  end
end
```

In case you are confusing, here is the structure of the services folder.  
![Services structures](assets/services_structure.png)]

Now navigate to `app/controllers/chat_gpt_controller`, remove `@reply_content = "pong"` and uncomment `@reply_content = Openai::Completion.call(params[:message_content])`

### Final result 
Check it out, you just create a clone of ChatGPT yourself! Run `./bin/dev` or `rails s` again and enjoy the result
![Final result](assets/final_result.png)