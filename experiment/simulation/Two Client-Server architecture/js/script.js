document.addEventListener('DOMContentLoaded', () => {
    class FAQ {
        constructor() {
            this.questions = {
                "What is client?": "A client is a device or application that requests services or resources from a server in a network.",
                "What is client-server architecture?": "A distributed computing system where the client computer requests information from the server computer, which splits tasks between the two.",
                "What is server?": "A server is a system that provides resources, data, or services to clients over a network.",
                "What is internet?": "The internet is a global network of interconnected computers and servers that enables communication and access to information worldwide.",
                "What is computer network?": "A computer network is a collection of interconnected computers and devices that communicate and share resources with each other.",
                
            };
        }

        getAnswer(question) {
            return this.questions[question] || "Sorry, I don't have an answer to that question.";
        }
        isPredefinedQuestion(question) {
          return this.questions.hasOwnProperty(question);
      }
    }

    const faq = new FAQ();

    const container = document.getElementById('container');
    const svgContainer = document.getElementById('svgContainer');
    const sourceNodes = document.querySelectorAll('.source-container .node');
    const destination = document.getElementById('destination');
    const destination2 = document.getElementById('destination2');
    const sendButton = document.getElementById('sendButton');
    const sendresponse = document.getElementById('sendresponse');
    const questionBox = document.getElementById('questionBox');
    const questionInput = document.getElementById('questionInput');
    const responseBox = document.getElementById('responseBox');
    const responseInput = document.getElementById('responseInput');
    const closeResponse = document.getElementById('closeResponse');
    const cloudDiv = document.createElement('div');
    cloudDiv.classList.add('cloud');
    const cloudText = document.createElement('div');
    cloudText.classList.add('text-display2');
    cloudText.textContent = 'Data packet lost';
    cloudDiv.appendChild(cloudText);
    container.appendChild(cloudDiv);
    cloudDiv.style.left = '72%';
    cloudDiv.style.top = '22%';
    cloudDiv.style.transform = 'translate(-50%, -50%)';
    cloudDiv.style.opacity = 0;
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');
    const image3 = document.getElementById('image3');
    const image4 = document.getElementById('image4');
    const image5 = document.getElementById('image5');
    const image6 = document.getElementById('image6');
    let requestSent = false;
    function createLine(startNode, endNode) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        svgContainer.appendChild(line);

        const startRect = startNode.getBoundingClientRect();
        const endRect = endNode.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const startX = startRect.left - containerRect.left + startRect.width / 2;
        const startY = startRect.top - containerRect.top + startRect.height / 2;
        const endX = endRect.left - containerRect.left + endRect.width / 2;
        const endY = endRect.top - containerRect.top + endRect.height / 2;

        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', endX);
        line.setAttribute('y2', endY);
        line.setAttribute('stroke', 'red');
        line.setAttribute('stroke-width', 2);
        
    }

    function createPacket(startNode, endNode, callback) {
        const packet = document.createElement('div');
        packet.classList.add('packet');
        container.appendChild(packet);

        const startRect = startNode.getBoundingClientRect();
        const endRect = endNode.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const startX = startRect.left - containerRect.left + startRect.width / 2;
        const startY = startRect.top - containerRect.top + startRect.height / 2;
        const endX = endRect.left - containerRect.left + endRect.width / 2;
        const endY = endRect.top - containerRect.top + endRect.height / 2;

        const duration = 3000; // time difference between the packets.
        let startTime;

        function animatePacket(time) {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            packet.style.left = `${currentX}px`;
            packet.style.top = `${currentY}px`;

            if (progress < 1) {
                requestAnimationFrame(animatePacket);
            } else {
                packet.style.left = `${endX}px`;
                packet.style.top = `${endY}px`;
                if (callback) callback();
            }
        }

        requestAnimationFrame(animatePacket);
    }
    
    function createTextDisplay(text, startNode, endNode) {
        const display = document.createElement('div');
        display.classList.add('text-display');
        display.textContent = text;
        container.appendChild(display);

        const startRect = startNode.getBoundingClientRect();
        const endRect = endNode.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const startX = startRect.left - containerRect.left + startRect.width / 2;
        const startY = startRect.top - containerRect.top + startRect.height / 2;
        const endX = endRect.left - containerRect.left + endRect.width / 2;
        const endY = endRect.top - containerRect.top + endRect.height / 2;

        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        display.style.left = `${midX}px`;
        display.style.top = `${midY}px`;

        const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
        display.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    
    }
   
    function startPacketsFromNode(node) {
        createPacket(node, destination, () => {
            createPacket(destination, destination2);
           
        });
        image1.classList.remove('hidden');
        image2.classList.remove('hidden');
        image3.classList.remove('hidden');
         // Hide response images initially
         image4.classList.add('hidden');
         image5.classList.add('hidden');
         image6.classList.add('hidden');
    }

  function sendPacketsFromServer() {
    const responseText = responseInput.value;
    sourceNodes.forEach((node, index) => {
       
        createTextDisplay('Sending response', destination, destination2);
       
        setTimeout(() => {
            createPacket(destination2, destination, () => {
                createPacket(destination, node);
                
                createTextDisplay('Sending response', node, destination);
                animateText(responseText, destination2, node);
            
               
            });
        }, index * 3000); //time of packets sending from server to client
    });
}

    sendButton.addEventListener('click', () => {
        questionBox.style.display = 'flex';
        questionInput.focus();
       
       
    });

    function animateText(text, startNode, endNode) {
    const textElement = document.createElement('div');
    textElement.classList.add('animated-text');
    textElement.textContent = text;
    container.appendChild(textElement);

    const startRect = startNode.getBoundingClientRect();
    const endRect = endNode.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const startX = startRect.left - containerRect.left + startRect.width / 2;
    const startY = startRect.top - containerRect.top + startRect.height / 2;
    const endX = endRect.left - containerRect.left + endRect.width / 2;
    const endY = endRect.top - containerRect.top + endRect.height / 2;

    const duration = 3000;// time interval for text client to server 
    let startTime;

    function animate(time) {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;

        textElement.style.left = `${currentX}px`;
        textElement.style.top = `${currentY}px`;
        textElement.style.opacity = 1 - progress;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            container.removeChild(textElement);
        }
    }

    requestAnimationFrame(animate);
}
questionInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const question = questionInput.value;
      if (question.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please enter a question.',
        });
        return;
      }
      requestSent = true;
      questionBox.style.display = 'none';
      sourceNodes.forEach((node, index) => {
        createLine(node, destination);
        createTextDisplay('Sending request', node, destination);
        
       
        
        setTimeout(() => {
          if (faq.questions[question]) {
            startPacketsFromNode(node);
            createTextDisplay('Sending request', destination, destination2);
            animateText(question, node, destination2);
            
          } else {
            // Create the cloud div
            animateText(question, node, destination);
            
            
            
            // Make the packet disappear at half way
        createPacket(node, destination);
         packet.style.opacity = 0.5;
         image1.classList.remove('hidden');
        image2.classList.remove('hidden');
        image3.classList.remove('hidden');
         // Hide response images initially
         image4.classList.add('hidden');
         image5.classList.add('hidden');
         image6.classList.add('hidden');
            setTimeout(() => {
              const packet = document.querySelector('.packet');
              packet.style.opacity = 0;
            }, 1000);
          }
        }, index * 500); // time of packets sending from node to server
      });
      createLine(destination, destination2);
    
    }
  });
 
  
sendresponse.addEventListener('click', () => {
  if (!requestSent) {
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please Send the "Request" first.',
      });
      return;
  }
  Swal.fire({
      title: "Request Processing!",
      html: " <b></b>",
      timer: 1200,
      timerProgressBar: true,
      didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`;
          }, 200);
      },
      willClose: () => {
          clearInterval(timerInterval);
      }
  }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
      }
      if(requestSent = true) {
        sendresponse.disabled=true;
      }
  });

  const userQuestion = questionInput.value;

  if (faq.isPredefinedQuestion(userQuestion)) {
      cloudDiv.style.opacity = 0;

      // Hide the initial set of images
      responseBox.style.display = 'flex';
      responseInput.value = faq.getAnswer(questionInput.value);
      image1.classList.add('hidden');
      image2.classList.add('hidden');
      image3.classList.add('hidden');

      // Show new set of images
      image4.classList.remove('hidden');
      image5.classList.remove('hidden');
      image6.classList.remove('hidden');
     
      // Simulate packet sending animation
      setTimeout(() => {
          sendPacketsFromServer();
      }, 100); // time of sending packets from server
  } else {
      cloudDiv.style.opacity = 1;
  }
 
  
});


    closeResponse.addEventListener('click', () => {
        responseBox.style.display = 'none';
    });

    const instructionsModal = document.getElementById('instructionsModal');
    const instructionsBtn = document.getElementById('instructionsBtn');
    const closeBtn = document.getElementById('closeBtn');

    instructionsBtn.addEventListener('click', () => {
        instructionsModal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        instructionsModal.style.display = 'none';
    });




});