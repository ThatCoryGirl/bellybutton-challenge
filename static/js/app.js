// Function to fetch JSON data
async function fetchData() {
    try {
      const response = await fetch('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Function to create the horizontal bar chart
  function createBarChart(sampleData) {
    const trace = {
      type: 'bar',
      x: sampleData.sample_values.slice(0, 10).reverse(),
      y: sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: sampleData.otu_labels.slice(0, 10).reverse(),
      orientation: 'h',
      marker: {
        // Set the color to match #ca007d
        color: '#ca007d'
      }
  
    };
  
    const layout = {
      title: 'Top 10 OTUs Found',
      xaxis: { title: 'Sample Values' }
    };
  
    Plotly.newPlot('bar', [trace], layout);
  }
  
  // Function to populate the dropdown menu
  function populateDropdown(sampleNames) {
    const dropdown = document.getElementById('selDataset');
    sampleNames.forEach(sample => {
      const option = document.createElement('option');
      option.text = sample;
      option.value = sample;
      dropdown.add(option);
    });
  }
  
  // Function to display sample metadata
  function displaySampleMetadata(metadata) {
    const metadataPanel = document.getElementById('sample-metadata');
    // Clear previous metadata
    metadataPanel.innerHTML = '';
    
    // Iterate over each key-value pair in the metadata and create HTML elements to display them
    Object.entries(metadata).forEach(([key, value]) => {
      const metadataItem = document.createElement('p');
      metadataItem.textContent = `${key}: ${value}`;
      metadataPanel.appendChild(metadataItem);
    });
  }
  
  // Function to create the bubble chart
  function createBubbleChart(sampleData) {
    const trace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        // Using Picnic colorscale
        // Found these sweet color schemes here: https://plotly.com/javascript/colorscales/
        colorscale: 'Picnic',
        opacity: 0.5
      }
    };
  
    const layout = {
      title: 'Bubble Chart for Each Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' }
    };
  
    Plotly.newPlot('bubble', [trace], layout);
  }
  
  // Function to handle dropdown change event
  function optionChanged(selectedSample) {
    fetchData().then(data => {
      const sampleData = data.samples.find(sample => sample.id === selectedSample);
      const sampleMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedSample)); // Find metadata for selected sample
      createBarChart(sampleData);
      createBubbleChart(sampleData);
      // Display sample metadata
      displaySampleMetadata(sampleMetadata);
    });
  }
  
  // Initial setup
  fetchData().then(data => {
    const sampleNames = data.names;
    const initialSample = sampleNames[0];
    populateDropdown(sampleNames);
    optionChanged(initialSample);
  });

  // Function to create the gauge chart
function createGaugeChart(washingFrequency) {
    const data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washingFrequency,
        title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 9] },
          steps: [
            // Lightest shade of magenta
            { range: [0, 1], color: "#fdf0f5" },
            { range: [1, 2], color: "#f8c3d7" },
            { range: [2, 3], color: "#f39ac3" },
            { range: [3, 4], color: "#eb73af" },
            { range: [4, 5], color: "#e24c9c" },
            { range: [5, 6], color: "#d9238a" },
            { range: [6, 7], color: "#ca007d" },
            { range: [7, 8], color: "#b40070" },
            // Darkest shade of magenta
            { range: [8, 9], color: "#99005b" }
          ],
          threshold: {
            line: { color: "blue", width: 4 },
            thickness: 0.75,
            value: washingFrequency
          }
        }
      }
    ];
  
    const layout = { width: 600, height: 400, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', data, layout);
  }
  
  // Function to handle dropdown change event
  function optionChanged(selectedSample) {
    fetchData().then(data => {
      const sampleData = data.samples.find(sample => sample.id === selectedSample);
      // Find metadata for selected sample
      const sampleMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedSample));
      createBarChart(sampleData);
      createBubbleChart(sampleData);
      // Display sample metadata
      displaySampleMetadata(sampleMetadata);
      // Create gauge chart with washing frequency
      createGaugeChart(sampleMetadata.wfreq);
    });
  }
  
  // Initial setup
  fetchData().then(data => {
    const sampleNames = data.names;
    const initialSample = sampleNames[0];
    populateDropdown(sampleNames);
    optionChanged(initialSample);
  });
  