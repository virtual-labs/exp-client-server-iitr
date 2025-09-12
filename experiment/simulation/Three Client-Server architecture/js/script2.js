let database = [];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const svgContainer = document.getElementById('svgContainer');
  const sourceNodes = document.querySelectorAll('.source-container .node');
  const destination = document.getElementById('destination');
  const destination2 = document.getElementById('destination2');
  const sendButton = document.getElementById('sendButton');
  const sendResponse = document.getElementById('sendresponse');
  const questionBox = document.getElementById('questionBox');
  const questionInput = document.getElementById('questionInput');
  const dataDisplay = document.getElementById('dataDisplay');
  const responseBox = document.getElementById('responseBox');
  const fetchEmail = document.getElementById('fetchEmail');
  const fetchBtn = document.getElementById('fetchBtn');
  const responseTableBody = document.getElementById('responseTableBody');
  const dataTableBody = document.getElementById('dataTableBody');
  const instructionsBtn = document.getElementById('instructionsBtn');
  const instructionsModal = document.getElementById('instructionsModal');
  const closeBtn = document.getElementById('closeBtn');
  const closeResponseBoxBtn = document.getElementById('closeResponseBoxBtn');
  const closeDataBoxBtn = document.getElementById('closeDataBoxBtn');
  const showIntroBtn = document.getElementById('showTier3IntroBtn');
  const cutBtn = document.getElementById('cutBtn');
  // Removed modalOverlay from here

  let requestSent = false;

  showIntroBtn.addEventListener('click', () => {
    Swal.fire({
      title: 'Three‑Tier Architecture',
        html: `
          <p>The <strong>Three-Tier Architecture</strong> is a client-server software pattern that divides an application into three main layers:</p>
          <ul style="text-align: left;">
            <li><strong>Presentation Tier:</strong>The front-end interface where users interact with the application.</li>
            <li><strong>Application Tier:</strong> Contains the business logic and handles communication between the UI and data layers.</li>
            <li><strong>Data Tier:</strong> Responsible for data storage, retrieval, and management, typically using a database.</li>
          </ul>
          <p>This model improves <strong>scalability</strong>, <strong>maintainability</strong>, and <strong>flexibility</strong>.</p>
        `,
      icon: 'info',
      confirmButtonText: 'Got it!'
    });
  });

  instructionsBtn.addEventListener('click', () => {
    instructionsModal.style.display = 'block';
    // removed modalOverlay.style.display = 'block';
  });
  closeBtn.addEventListener('click', () => {
    instructionsModal.style.display = 'none';
    // removed modalOverlay.style.display = 'none';
  });
  closeResponseBoxBtn.addEventListener('click', () => {
    responseBox.style.display = 'none';
    // removed modalOverlay.style.display = 'none';
  });
  closeDataBoxBtn.addEventListener('click', () => {
    dataDisplay.style.display = 'none';
    // removed modalOverlay.style.display = 'none';
  });
  cutBtn.addEventListener('click', () => {
    questionBox.style.display = 'none';
    // removed modalOverlay.style.display = 'none';
  });

  // Draw lines with arrowheads between client-server and server-db
  function drawLinesWithArrows() {
    // Clear existing lines
    while (svgContainer.firstChild) {
      svgContainer.removeChild(svgContainer.firstChild);
    }

    // Define arrowhead marker
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <marker id="arrowHead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="red" />
      </marker>
    `;
    svgContainer.appendChild(defs);

    // Draw line: Client(s) to Server
    sourceNodes.forEach(sourceNode => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      const sX = sourceNode.offsetLeft + sourceNode.offsetWidth / 2;
      const sY = sourceNode.offsetTop + sourceNode.offsetHeight / 2;
      const eX = destination.offsetLeft + destination.offsetWidth / 2;
      const eY = destination.offsetTop + destination.offsetHeight / 2;
      line.setAttribute('x1', sX);
      line.setAttribute('y1', sY);
      line.setAttribute('x2', eX);
      line.setAttribute('y2', eY);
      line.setAttribute('stroke', 'red');
      line.setAttribute('stroke-width', 2);
      line.setAttribute('marker-end', 'url(#arrowHead)');
      svgContainer.appendChild(line);
    });

    // Draw line: Server to DB
    const serverToDBLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const sX = destination.offsetLeft + destination.offsetWidth / 2;
    const sY = destination.offsetTop + destination.offsetHeight / 2;
    const eX = destination2.offsetLeft + destination2.offsetWidth / 2;
    const eY = destination2.offsetTop + destination2.offsetHeight / 2;
    serverToDBLine.setAttribute('x1', sX);
    serverToDBLine.setAttribute('y1', sY);
    serverToDBLine.setAttribute('x2', eX);
    serverToDBLine.setAttribute('y2', eY);
    serverToDBLine.setAttribute('stroke', 'red');
    serverToDBLine.setAttribute('stroke-width', 2);
    serverToDBLine.setAttribute('marker-end', 'url(#arrowHead)');
    svgContainer.appendChild(serverToDBLine);
  }

  // Initial draw
  drawLinesWithArrows();

  // Animate packet from one node to another inside the container
  function animatePacket(startNode, endNode, labelText, callback) {
    const packet = document.createElement('div');
    packet.className = 'packet';
    container.appendChild(packet);

    const x0 = startNode.offsetLeft + startNode.offsetWidth / 2;
    const y0 = startNode.offsetTop + startNode.offsetHeight / 2;
    const x1 = endNode.offsetLeft + endNode.offsetWidth / 2;
    const y1 = endNode.offsetTop + endNode.offsetHeight / 2;

    const label = labelText ? (() => {
      const lbl = document.createElement('div');
      lbl.className = 'text-display';
      lbl.textContent = labelText;
      container.appendChild(lbl);
      return lbl;
    })() : null;

    let startTime = null;
    const duration = 1000;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const t = Math.min((timestamp - startTime) / duration, 1);
      const currX = x0 + (x1 - x0) * t;
      const currY = y0 + (y1 - y0) * t;
      packet.style.left = currX + 'px';
      packet.style.top = currY + 'px';
      if (label) {
        label.style.left = currX + 10 + 'px';
        label.style.top = currY + 'px';
      }
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        packet.remove();
        label && label.remove();
        callback && callback();
      }
    }
    requestAnimationFrame(step);
  }

  // Handle "Send Request"
  sendButton.addEventListener('click', () => {
    questionBox.style.display = 'flex';
    // Removed modalOverlay.style.display = 'block';
  });

  questionInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!questionInput.checkValidity()) {
        Swal.fire('Error', 'All fields are required!', 'error');
        return;
      }
      const formData = new FormData(questionInput);
      const data = Object.fromEntries(formData.entries());
      database.push(data);
      dataTableBody.innerHTML += `<tr><td>${data.name}</td><td>${data.email}</td><td>${data.message}</td></tr>`;
      questionBox.style.display = 'none';
      dataDisplay.style.display = 'block';
      // Removed modalOverlay.style.display = 'block';
      sendResponse.disabled = false;
      sourceNodes.forEach((sourceNode, idx) => {
        setTimeout(() => {
          animatePacket(sourceNode, destination, 'Request', () => {
            animatePacket(destination, destination2, '→ Server', () => {});
          });
        }, idx * 500);
      });
    }
  });

  // Handle "Send Response"
  sendResponse.addEventListener('click', () => {
    if (!database.length) {
      Swal.fire('Oops...', 'Send request first!', 'error');
      return;
    }
    responseBox.style.display = 'block';
    // Removed modalOverlay.style.display = 'block';
    sendResponse.disabled = true;
  });

  // Handle "Fetch"
  fetchBtn.addEventListener('click', () => {
    const email = fetchEmail.value.trim();
    const matches = database.filter(entry => entry.email === email);
    if (!matches.length) {
      Swal.fire('No Data', 'No records found.', 'info');
      return;
    }
    responseTableBody.innerHTML = matches.map(m =>
      `<tr><td>${m.name}</td><td>${m.email}</td><td>${m.message}</td></tr>`
    ).join('');
    sourceNodes.forEach((sourceNode, idx) => {
      setTimeout(() => {
        animatePacket(destination2, destination, 'Response', () => {
          animatePacket(destination, sourceNode, '← Back', () => {});
        });
      }, idx * 500);
    });
  });
});
