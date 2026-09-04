import type { Testimonial } from '@rdplatforms/types';
import { activeDataSource } from './dataSource/activeDataSource';
import type { TestimonialDataSource } from './dataSource/types';

export class TestimonialService {
  constructor(private readonly dataSource: TestimonialDataSource) {}

  getByBusiness(businessId: string): Promise<Testimonial[]> {
    return this.dataSource.listTestimonialsByBusiness(businessId);
  }
}

export const testimonialService = new TestimonialService(activeDataSource);
