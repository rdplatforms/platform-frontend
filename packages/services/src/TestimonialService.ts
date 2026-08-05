import type { Testimonial } from '@rdplatforms/types';
import { jsonDataSource } from './dataSource/JsonDataSource';
import type { TestimonialDataSource } from './dataSource/types';

export class TestimonialService {
  constructor(private readonly dataSource: TestimonialDataSource) {}

  getByBusiness(businessId: string): Promise<Testimonial[]> {
    return this.dataSource.listTestimonialsByBusiness(businessId);
  }
}

export const testimonialService = new TestimonialService(jsonDataSource);
