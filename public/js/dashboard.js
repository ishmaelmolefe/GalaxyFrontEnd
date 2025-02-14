document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch('/api/dashboard-data', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
  
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
  
      const insights = await response.json();
      console.log(insights);
  
      document.getElementById('numberOfCustomers').textContent = insights.numberOfCustomers;
      document.getElementById('totalCars').textContent = insights.totalCars;
      document.getElementById('availableCars').textContent = insights.availableCars;
      document.getElementById('unavailableCars').textContent = insights.unavailableCars;
  
      // Parse top 5 brands to use in the bar chart
      const top5Brands = insights.top5Brands.map(item => {
        const [brand, count] = item.split(": ");
        return { brand, count: parseInt(count) };
      });
  
      const barChartOptions = {
        series: [
          {
            data: top5Brands.map(item => item.count),
            name: 'Cars',
          },
        ],
        chart: {
          type: 'bar',
          background: 'transparent',
          height: 350,
          toolbar: {
            show: false,
          },
        },
        colors: ['#2962ff', '#d50000', '#2e7d32', '#ff6d00', '#583cb3'],
        plotOptions: {
          bar: {
            distributed: true,
            borderRadius: 4,
            horizontal: false,
            columnWidth: '40%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          opacity: 1,
        },
        grid: {
          borderColor: '#55596e',
          yaxis: {
            lines: {
              show: true,
            },
          },
          xaxis: {
            lines: {
              show: true,
            },
          },
        },
        legend: {
          labels: {
            colors: '#f5f7ff',
          },
          show: true,
          position: 'top',
        },
        stroke: {
          colors: ['transparent'],
          show: true,
          width: 2,
        },
        tooltip: {
          shared: true,
          intersect: false,
          theme: 'dark',
        },
        xaxis: {
          categories: top5Brands.map(item => item.brand),
          title: {
            style: {
              color: '#f5f7ff',
            },
          },
          axisBorder: {
            show: true,
            color: '#55596e',
          },
          axisTicks: {
            show: true,
            color: '#55596e',
          },
          labels: {
            style: {
              colors: '#f5f7ff',
            },
          },
        },
        yaxis: {
          title: {
            text: 'Count',
            style: {
              color: '#f5f7ff',
            },
          },
          axisBorder: {
            color: '#55596e',
            show: true,
          },
          axisTicks: {
            color: '#55596e',
            show: true,
          },
          labels: {
            style: {
              colors: '#f5f7ff',
            },
          },
        },
      };
  
      const barChart = new ApexCharts(
        document.querySelector('#bar-chart'),
        barChartOptions
      );
      barChart.render();
  
      const pieChartOptions = {
        series: [
          insights.completedRentalsCount,  
          insights.activeRentalsCount, 
        ],
        chart: {
          type: 'pie',
          background: 'transparent',
          height: 350,
          toolbar: {
            show: false,
          },
        },
        labels: ['Completed Rentals', 'Active Rentals'],
        colors: ['#00ab57', '#d50000'],
        dataLabels: {
          enabled: true,
          style: {
            colors: ['#f5f7ff'],
          },
        },
        tooltip: {
          shared: true,
          intersect: false,
          theme: 'dark',
          y: {
            formatter: function(value) {
              return 'R' + value.toLocaleString();
            },
          },
        },
        legend: {
          labels: {
            colors: '#f5f7ff',
          },
          show: true,
          position: 'top',
        },
      };
  
      const pieChart = new ApexCharts(
        document.querySelector('#area-chart'),
        pieChartOptions
      );
      pieChart.render();
  
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      document.getElementById('errorMessage').textContent = "Unable to load data.";
    }
  });
  