// Performance Testing Utilities
// Run this in browser console to test performance

interface PerformanceTest {
  name: string;
  fn: () => Promise<void> | void;
  iterations?: number;
}

class PerformanceTester {
  private results: Map<string, number[]> = new Map();

  async runTest(test: PerformanceTest): Promise<void> {
    const iterations = test.iterations || 100;
    const times: number[] = [];

    console.log(`Running test: ${test.name} (${iterations} iterations)`);

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await test.fn();
      const end = performance.now();
      times.push(end - start);
    }

    this.results.set(test.name, times);
    this.printResults(test.name, times);
  }

  private printResults(name: string, times: number[]): void {
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const median = this.calculateMedian(times);

    console.log(`\n${name} Results:`);
    console.log(`  Average: ${avg.toFixed(2)}ms`);
    console.log(`  Median: ${median.toFixed(2)}ms`);
    console.log(`  Min: ${min.toFixed(2)}ms`);
    console.log(`  Max: ${max.toFixed(2)}ms`);
  }

  private calculateMedian(arr: number[]): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  async runAllTests(tests: PerformanceTest[]): Promise<void> {
    console.log('Starting Performance Tests...\n');
    for (const test of tests) {
      await this.runTest(test);
    }
    console.log('\nAll tests completed!');
  }
}

// Run all tests
async function runAllPerformanceTests(): Promise<void> {
  console.clear();
  console.log('='.repeat(60));
  console.log('LegacyCompass Performance Test Suite');
  console.log('='.repeat(60));

  const performanceTests: PerformanceTest[] = [
    {
      name: 'Lead Filtering (1000 leads)',
      fn: () => {
        const leads = Array.from({ length: 1000 }, (_, i) => ({
          id: `lead-${i}`,
          companyName: `Company ${i}`,
          industry: ['Technology', 'Healthcare', 'Finance'][i % 3],
          score: Math.random() * 100,
          status: 'new' as const,
        }));

        leads.filter(lead => lead.industry === 'Technology' && lead.score > 50);
      },
      iterations: 1000
    },
    {
      name: 'Search Query (1000 leads)',
      fn: () => {
        const leads = Array.from({ length: 1000 }, (_, i) => ({
          id: `lead-${i}`,
          companyName: `Company ${i}`,
          industry: `Industry ${i % 10}`,
        }));

        const query = 'company 5';
        leads.filter(lead =>
          lead.companyName.toLowerCase().includes(query) ||
          lead.industry.toLowerCase().includes(query)
        );
      },
      iterations: 1000
    }
  ];

  const tester = new PerformanceTester();
  await tester.runAllTests(performanceTests);

  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('\nMemory Usage:');
    console.log(`  Used: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Total: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
  }

  console.log('\n✅ Performance testing complete!');
}

if (typeof window !== 'undefined') {
  (window as any).runPerformanceTests = runAllPerformanceTests;
  console.log('Performance testing utilities loaded!');
  console.log('Run: runPerformanceTests() to start all tests');
}

export { runAllPerformanceTests };
